import { getSupabaseClient } from '@/lib/supabase-auth';
import type { AppData, Client, Project, Task, Quote, AppSettings, ThemeSettings, AIAnalysis } from '@/lib/types';
import { initialAppData } from '@/lib/data';
import { encrypt, decrypt } from '@/lib/encryption';

// Helper to convert Supabase/PostgrestError to proper Error
function toError(err: any): Error {
  if (err instanceof Error) return err;
  if (err?.message) return new Error(err.message);
  if (err?.error_description) return new Error(err.error_description);
  if (typeof err === 'string') return new Error(err);
  return new Error(JSON.stringify(err) || 'Unknown error');
}

// Helper to safely parse JSON or return value as single-item array
const safeDecryptArray = (cipher: string): string[] => {
  const decrypted = decrypt(cipher);
  if (!decrypted) return [];
  try {
    const parsed = JSON.parse(decrypted);
    return Array.isArray(parsed) ? parsed : [decrypted];
  } catch {
    return [decrypted]; // Handle legacy plain text that isn't JSON
  }
};

export class SupabaseDataService {

  private static get client() {
    return getSupabaseClient();
  }

  // Load all user data into AppData format for compatibility
  static async loadAppData(): Promise<AppData> {
    const client = this.client;

    if (!client) {
      throw new Error('Supabase client not available');
    }

    const { data: { user }, error: userError } = await client.auth.getUser();

    if (userError) {
      console.error('Supabase auth error:', userError);
      throw new Error('Authentication error: ' + userError.message);
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Fetch all data in parallel
      const [clientsRes, projectsRes, tasksRes, quotesRes, settingsRes, workSessionsRes, collaboratorsRes, categoriesRes, fixedCostsRes, expensesRes, notesRes, eventsRes, quoteTemplatesRes, collaboratorQuotesRes, aiAnalysesRes] = await Promise.all([
        client.from('clients').select('*'),
        client.from('projects').select('*'),
        client.from('tasks').select('*'),
        client.from('quotes').select('*'), // Don't join quote_items - data is in quote_data JSONB
        client.from('user_settings').select('*').single(),
        client.from('work_sessions').select('*'),
        client.from('collaborators').select('*'),
        client.from('categories').select('*'),
        client.from('fixed_costs').select('*'),
        client.from('expenses').select('*'),
        client.from('notes').select('*'),
        client.from('events').select('*'),
        client.from('quote_templates').select('*'),
        client.from('collaborator_quotes').select('*'),
        client.from('ai_analyses').select('*'),
      ]);

      // Handle potential errors
      const checkError = (res: any, name: string) => {
        if (res.error && res.error.code !== 'PGRST116') { // PGRST116 is "no rows found"
          console.warn(`Error loading ${name}:`, res.error);
          return [];
        }
        return res.data || [];
      };

      const clients = checkError(clientsRes, 'clients');
      const projects = checkError(projectsRes, 'projects');
      const tasks = checkError(tasksRes, 'tasks');
      const quotes = checkError(quotesRes, 'quotes');
      const workSessions = checkError(workSessionsRes, 'workSessions');
      const collaborators = checkError(collaboratorsRes, 'collaborators');
      const categories = checkError(categoriesRes, 'categories');
      const fixedCosts = checkError(fixedCostsRes, 'fixedCosts');
      const expenses = checkError(expensesRes, 'expenses');
      const notes = checkError(notesRes, 'notes');
      const events = checkError(eventsRes, 'events');
      const aiAnalyses = checkError(aiAnalysesRes, 'aiAnalyses');

      // Decrypt sensitive client data
      const decryptedClients = clients.map((c: any) => ({
        ...c,

        name: decrypt(c.name), // Decrypt name
        company: decrypt(c.company), // Decrypt company
        email: safeDecryptArray(c.email),
        phone: safeDecryptArray(c.phone),
        address: decrypt(c.address),
        notes: decrypt(c.notes),
      }));

      // Decrypt note content
      const decryptedNotes = notes.map((n: any) => ({
        ...n,
        title: decrypt(n.title),
        content: decrypt(n.content),
      }));
      const quoteTemplates = checkError(quoteTemplatesRes, 'quoteTemplates');
      const collaboratorQuotes = checkError(collaboratorQuotesRes, 'collaboratorQuotes');

      // Settings handling - create default if doesn't exist
      let settings: AppSettings = initialAppData.appSettings;

      if (settingsRes.data) {
        const defaultTheme: ThemeSettings = { primary: '#6366f1', accent: '#8b5cf6' };
        settings = {
          ...initialAppData.appSettings,
          language: settingsRes.data.language || 'en',
          theme: settingsRes.data.theme ? JSON.parse(settingsRes.data.theme) : defaultTheme,
          currency: settingsRes.data.currency || 'VND',
          googleApiKey: settingsRes.data.google_api_key || '',
          googleModel: settingsRes.data.google_model || 'gemini-2.5-flash',
          ...settingsRes.data.settings_json,
        };
      }

      // Debug: Log raw data from Supabase
      console.log('🔍 Supabase loadAppData - raw projects from DB:', projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        client_id: p.client_id,
        project_data: p.project_data,
      })));
      console.log('🔍 Supabase loadAppData - raw clients from DB:', clients.map((c: any) => ({
        id: c.id,
        name: c.name,
      })));

      return {
        ...initialAppData, // Start with defaults to ensure all properties exist
        clients: decryptedClients as Client[],
        projects: projects.map((p: any) => {
          // Restore extra data from project_data JSONB
          const extraData = p.project_data || {};
          // Remove snake_case fields that would conflict with camelCase
          const { client_id, start_date, end_date, task_ids, project_data, user_id, created_at, updated_at, ...restP } = p;
          return {
            ...restP,       // Spread remaining fields from Supabase (id, name, description, status)
            ...extraData,   // Spread extra data from JSONB
            // Override with properly converted fields from DB columns
            id: p.id,
            name: decrypt(p.name),
            description: decrypt(p.description),
            status: p.status || 'active',
            clientId: p.client_id || undefined,
            startDate: p.start_date ? new Date(p.start_date) : undefined,
            endDate: p.end_date ? new Date(p.end_date) : undefined,
            tasks: p.task_ids || [],
          };
        }) as Project[],
        tasks: tasks.map((task: any) => {
          // Restore extra data from task_data JSONB (briefLink, driveLink, collaboratorIds, etc.)
          const extraData = task.task_data || {};
          // Remove snake_case fields that would conflict with camelCase
          const { project_id, client_id, category_id, quote_id, start_date, task_data, user_id, created_at, updated_at, estimated_hours, actual_hours, ...restTask } = task;
          return {
            ...restTask,    // Spread remaining fields (id, name, description, status, priority, deadline, tags, etc.)
            ...extraData,   // Spread extra data from JSONB
            // Override with properly converted fields from DB columns
            id: task.id,
            name: decrypt(task.name),
            description: decrypt(task.description),
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            projectId: task.project_id || undefined,
            clientId: task.client_id || '',
            categoryId: task.category_id || 'default',
            quoteId: task.quote_id || '',
            startDate: task.start_date ? new Date(task.start_date) : new Date(),
            deadline: task.deadline ? new Date(task.deadline) : new Date(),
            estimatedHours: task.estimated_hours || 0,
            actualHours: task.actual_hours || 0,
            createdAt: task.created_at || new Date().toISOString(),
          };
        }) as Task[],
        quotes: quotes.map((quote: any) => {
          // Restore full quote data from JSONB quote_data field
          const extraData = quote.quote_data || {};

          // DEBUG: Log quote loading
          console.log('📊 [loadAppData Debug] Quote loaded:', {
            id: quote.id,
            quote_data_keys: Object.keys(extraData),
            sectionsCount: extraData.sections?.length,
          });

          return {
            id: quote.id,
            status: quote.status || 'draft',
            total: quote.total_amount || 0,
            // Restore sections, payments, columns, amountPaid from quote_data
            sections: extraData.sections || (quote.quote_items ? [{
              id: 'default',
              name: 'Items',
              items: quote.quote_items.map((item: any) => ({
                id: item.id,
                description: item.description || item.name,
                unitPrice: item.unit_price || 0,
                quantity: item.quantity || 1,
              }))
            }] : []),
            payments: extraData.payments || [],
            columns: extraData.columns,
            amountPaid: extraData.amountPaid || 0,
            // IMPORTANT: Restore paidDate and payment details for correct revenue date calculation
            paidDate: extraData.paidDate,
            paymentMethod: extraData.paymentMethod,
            paymentNotes: extraData.paymentNotes,
          };
        }) as Quote[],
        workSessions: workSessions.map((session: any) => ({
          ...session,
          taskId: session.task_id,
          projectId: session.project_id,
          startTime: new Date(session.start_time),
          endTime: session.end_time ? new Date(session.end_time) : undefined,
          durationMinutes: session.duration_minutes || 0,
        })),
        collaborators: collaborators.map((c: any) => {
          const extraData = c.collaborator_data || {};
          return {
            ...c,
            ...extraData,
            name: decrypt(c.name),
            email: decrypt(c.email),
            phone: decrypt(c.phone),
            notes: decrypt(c.notes)
          };
        }),
        categories: categories.map((c: any) => {
          const extraData = c.category_data || {};
          return { ...c, ...extraData };
        }),
        fixedCosts: fixedCosts.map((fc: any) => {
          const extraData = fc.cost_data || {};
          return {
            ...extraData,
            id: fc.id,
            name: decrypt(fc.name),
            amount: fc.amount,
            frequency: fc.frequency,
            category: fc.category,
            isActive: fc.is_active ?? extraData.isActive ?? true,
            startDate: extraData.startDate || fc.start_date,
            endDate: extraData.endDate || fc.end_date,
            createdAt: extraData.createdAt || fc.created_at,
            updatedAt: extraData.updatedAt || fc.updated_at,
          };
        }),
        expenses: expenses.map((e: any) => {
          const extraData = e.expense_data || {};
          return { ...e, ...extraData, name: decrypt(e.name), notes: decrypt(e.notes) };
        }),
        notes: decryptedNotes.map((n: any) => {
          const extraData = n.note_data || {};
          return { ...n, ...extraData };
        }),
        events: events.map((ev: any) => {
          const extraData = ev.event_data || {};
          return { ...ev, ...extraData, name: decrypt(ev.name), notes: decrypt(ev.notes) };
        }),
        quoteTemplates: quoteTemplates.map((t: any) => {
          const extraData = t.template_data || {};
          return { ...t, ...extraData };
        }),
        collaboratorQuotes: collaboratorQuotes.map((cq: any) => {
          const extraData = cq.quote_data || {};
          return {
            ...cq,
            ...extraData,
            collaboratorId: cq.collaborator_id,
            taskId: cq.task_id,
            total: cq.total_amount || 0,
          };
        }),
        aiAnalyses: aiAnalyses.map((a: any) => ({
          id: a.id,
          userId: a.user_id || 'user-1',
          timestamp: a.timestamp,
          analysis: a.analysis
        })),
        appSettings: settings,
      };
    } catch (error) {
      console.error('Error loading app data:', error);
      throw error;
    }
  }

  // Save individual collections
  static async saveClients(clients: Client[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    // Delete existing and insert new ones (simple approach)
    await client.from('clients').delete().neq('id', 'dummy'); // Delete all

    if (clients.length > 0) {
      // Deduplicate clients by ID
      const uniqueClients = Array.from(new Map(clients.map(c => [c.id, c])).values());

      const clientsWithUserId = uniqueClients.map(c => {
        const { id, name, email, phone, address, company, notes, ...extraData } = c as any;
        return {
          id,
          user_id: user.data.user!.id,
          name: encrypt(name || ''),
          email: encrypt(JSON.stringify(email || [])),
          phone: encrypt(JSON.stringify(phone || [])),
          address: encrypt(address || ''),
          company: encrypt(company || ''),
          notes: encrypt(notes || ''),
          client_data: extraData, // Store extra fields in JSONB
        };
      });

      const { error } = await client.from('clients').upsert(clientsWithUserId, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  static async saveProjects(projects: Project[], validClientIds?: Set<string>): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('projects').delete().neq('id', 'dummy');

    if (projects.length > 0) {
      // Deduplicate projects by ID
      const uniqueProjects = Array.from(new Map(projects.map(p => [p.id, p])).values());

      const projectsWithUserId = uniqueProjects.map(p => {
        // Destructure known fields, rest goes to extraData
        const {
          id, name, description, clientId, status, startDate, endDate, tasks,
          // Also remove any snake_case fields that may have leaked from previous loads
          client_id, start_date, end_date, task_ids, project_data, user_id, created_at, updated_at,
          ...extraData
        } = p as any;
        // Only set client_id if it's a valid client ID (or null if not provided/invalid)
        const validClientId = clientId && validClientIds?.has(clientId) ? clientId : null;
        return {
          id,
          user_id: user.data.user!.id,
          name: encrypt(name || ''),
          description: encrypt(description || ''),
          client_id: validClientId,
          status: status || 'active',
          start_date: startDate instanceof Date ? startDate.toISOString() : startDate,
          end_date: endDate instanceof Date ? endDate.toISOString() : endDate,
          task_ids: tasks,
          project_data: extraData, // Store extra fields in JSONB (now clean of snake_case)
        };
      });

      const { error } = await client.from('projects').upsert(projectsWithUserId, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('tasks').delete().neq('id', 'dummy');

    if (tasks.length > 0) {
      // Deduplicate tasks by ID
      const uniqueTasks = Array.from(new Map(tasks.map(t => [t.id, t])).values());

      const tasksWithUserId = uniqueTasks.map(t => {
        // Extract only DB columns, store rest in task_data JSONB
        // Also remove any snake_case fields that may have leaked from previous loads
        const {
          id, name, description, status, priority, projectId, clientId,
          categoryId, quoteId, startDate, deadline, estimatedHours,
          actualHours, eisenhowerQuadrant, tags, vector, deletedAt,
          // Remove snake_case fields
          project_id, client_id, category_id, quote_id, start_date, task_data,
          user_id, created_at, updated_at, estimated_hours, actual_hours,
          eisenhower_quadrant, deleted_at,
          ...extraData
        } = t as any;

        return {
          id,
          user_id: user.data.user!.id,
          name: encrypt(name || ''),
          description: encrypt(description || ''),
          status: status || 'todo',
          priority,
          project_id: projectId,
          client_id: clientId,
          category_id: categoryId,
          quote_id: quoteId,
          start_date: startDate instanceof Date ? startDate.toISOString() : startDate,
          deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
          estimated_hours: estimatedHours,
          actual_hours: actualHours,
          eisenhower_quadrant: eisenhowerQuadrant,
          tags,
          vector,
          deleted_at: deletedAt,
          task_data: extraData, // Store all extra fields in JSONB (now clean of snake_case)
        };
      });

      const { error } = await client.from('tasks').upsert(tasksWithUserId, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  static async saveQuotes(quotes: Quote[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('quotes').delete().neq('id', 'dummy');
    await client.from('quote_items').delete().neq('id', 'dummy');

    if (quotes.length > 0) {
      // Deduplicate quotes by ID
      const uniqueQuotes = Array.from(new Map(quotes.map(q => [q.id, q])).values());

      // Insert quotes first - store all quote data in JSONB
      const quotesWithUserId = uniqueQuotes.map(q => {
        const { id, status, total, ...extraData } = q as any;
        return {
          id,
          user_id: user.data.user!.id,
          title: encrypt(id), // Encrypt ID as title since it's used as title if no other title provided. Wait, actually we can just encrypt 'Quote' or leave it to standard logic. Let's encrypt id.
          status: status || 'draft',
          total_amount: total || 0,
          description: encrypt(''),
          quote_data: extraData, // Store sections, items, etc. in JSONB
        };
      });

      // DEBUG: Log quote_data before save
      console.log('📊 [saveQuotes Debug] Quote data to save:', quotesWithUserId.map(q => ({
        id: q.id,
        status: q.status,
        quote_data_keys: Object.keys(q.quote_data || {}),
        sectionsCount: q.quote_data?.sections?.length,
        firstSectionItems: q.quote_data?.sections?.[0]?.items?.length,
      })));

      const { error: quotesError } = await client.from('quotes').upsert(quotesWithUserId, { onConflict: 'user_id,id' });
      if (quotesError) throw toError(quotesError);

      // Insert quote items (for querying purposes)
      const allItems: any[] = [];
      let globalItemIndex = 0;
      // Build a fast lookup of inserted quote IDs to satisfy FK
      const insertedQuoteIds = new Set(quotesWithUserId.map(q => q.id).filter(Boolean));
      quotes.forEach(quote => {
        // Guard: skip if quote id is missing (FK safety)
        if (!quote || !quote.id) return;
        if (!insertedQuoteIds.has(quote.id)) return;
        if (quote.sections) {
          quote.sections.forEach((section: any, sectionIndex: number) => {
            if (section.items) {
              section.items.forEach((item: any, itemIndex: number) => {
                // Use item.id if available, otherwise generate unique ID
                const itemId = item.id || `${quote.id}-s${sectionIndex}-i${itemIndex}-${globalItemIndex}`;
                allItems.push({
                  id: itemId,
                  user_id: user.data.user!.id,
                  quote_id: quote.id,
                  name: item.description,
                  description: item.description,
                  quantity: item.quantity || 1,
                  unit_price: item.unitPrice || 0,
                  total_price: (item.unitPrice || 0) * (item.quantity || 1),
                  sort_order: globalItemIndex,
                });
                globalItemIndex++;
              });
            }
          });
        }
      });

      if (allItems.length > 0) {
        const { error: itemsError } = await client.from('quote_items').upsert(allItems, { onConflict: 'user_id,id' });
        if (itemsError) throw toError(itemsError);
      }
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    const settingsData = {
      user_id: user.data.user!.id,
      language: settings.language,
      theme: JSON.stringify(settings.theme),
      currency: settings.currency,
      google_api_key: settings.googleApiKey,
      google_model: settings.googleModel,
      settings_json: settings,
    };

    const { error } = await client.from('user_settings').upsert(settingsData);
    if (error) throw toError(error);
  }

  static async saveWorkSessions(sessions: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();

    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('work_sessions').delete().neq('id', 'dummy');

    if (sessions.length > 0) {
      const sessionsWithUserId = sessions.map(s => ({
        // Explicitly map ONLY the fields that exist in the DB schema
        id: s.id,
        user_id: user.data.user!.id,
        task_id: s.taskId,
        project_id: s.projectId,
        // Handle both Date objects and potential ISO strings, converting empty strings to null
        start_time: (s.startTime && s.startTime !== '')
          ? (s.startTime instanceof Date ? s.startTime.toISOString() : s.startTime)
          : null,
        end_time: (s.endTime && s.endTime !== '')
          ? (s.endTime instanceof Date ? s.endTime.toISOString() : s.endTime)
          : null,
        duration_minutes: s.durationMinutes || 0,
        // Do NOT spread ...s here to avoid sending camelCase props (endTime, startTime) that don't exist in DB
      }));

      const { error } = await client.from('work_sessions').upsert(sessionsWithUserId, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save collaborators
  static async saveCollaborators(collaborators: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('collaborators').delete().neq('id', 'dummy');

    if (collaborators.length > 0) {
      // Deduplicate collaborators by ID
      const uniqueCollaborators = Array.from(new Map(collaborators.map(c => [c.id, c])).values());

      const data = uniqueCollaborators.map(c => {
        const { id, name, email, phone, role, rate, notes, ...extraData } = c;
        return {
          id, user_id: user.data.user!.id,
          name: encrypt(name || ''),
          email: encrypt(email || ''),
          phone: encrypt(phone || ''),
          role, rate,
          notes: encrypt(notes || ''),
          collaborator_data: extraData,
        };
      });
      const { error } = await client.from('collaborators').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save collaborator quotes
  static async saveCollaboratorQuotes(quotes: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('collaborator_quotes').delete().neq('id', 'dummy');

    if (quotes.length > 0) {
      const data = quotes.map(q => {
        const { id, collaboratorId, taskId, status, total, ...extraData } = q;
        return {
          id, user_id: user.data.user!.id,
          collaborator_id: collaboratorId, task_id: taskId, status, total_amount: total || 0,
          quote_data: extraData,
        };
      });
      const { error } = await client.from('collaborator_quotes').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save categories
  static async saveCategories(categories: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('categories').delete().neq('id', 'dummy');

    if (categories.length > 0) {
      const data = categories.map(c => {
        const { id, name, color, icon, ...extraData } = c;
        return {
          id, user_id: user.data.user!.id, name, color, icon,
          category_data: extraData,
        };
      });
      const { error } = await client.from('categories').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save quote templates
  static async saveQuoteTemplates(templates: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('quote_templates').delete().neq('id', 'dummy');

    if (templates.length > 0) {
      const data = templates.map(t => {
        const { id, name, description, ...extraData } = t;
        return {
          id, user_id: user.data.user!.id, name, description,
          template_data: extraData,
        };
      });
      const { error } = await client.from('quote_templates').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save notes
  static async saveNotes(notes: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('notes').delete().neq('id', 'dummy');

    if (notes.length > 0) {
      const data = notes.map(n => {
        const { id, title, content, color, position, ...extraData } = n;
        return {
          id, user_id: user.data.user!.id,
          title: encrypt(title || ''),
          content: encrypt(content || ''),
          color, position,
          note_data: extraData,
        };
      });
      const { error } = await client.from('notes').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save events
  static async saveEvents(events: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('events').delete().neq('id', 'dummy');

    if (events.length > 0) {
      const data = events.map(e => {
        const { id, name, startTime, endTime, taskIds, color, icon, notes, ...extraData } = e;
        return {
          id, user_id: user.data.user!.id,
          name: encrypt(name || ''),
          start_time: startTime, end_time: endTime, task_ids: taskIds,
          color, icon,
          notes: encrypt(notes || ''),
          event_data: extraData,
        };
      });
      const { error } = await client.from('events').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save fixed costs
  static async saveFixedCosts(costs: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('fixed_costs').delete().neq('id', 'dummy');

    if (costs.length > 0) {
      const data = costs.map(c => {
        const { id, name, amount, frequency, category, isActive, startDate, endDate, createdAt, updatedAt, ...extraData } = c;
        return {
          id, user_id: user.data.user!.id,
          name: encrypt(name || ''),
          amount, frequency, category,
          is_active: isActive ?? true,
          cost_data: {
            ...extraData,
            startDate,
            endDate,
            createdAt,
            updatedAt,
          },
        };
      });
      const { error } = await client.from('fixed_costs').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save expenses
  static async saveExpenses(expenses: any[]): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    await client.from('expenses').delete().neq('id', 'dummy');

    if (expenses.length > 0) {
      const data = expenses.map(e => {
        const { id, name, amount, date, category, projectId, taskId, notes, ...extraData } = e;
        return {
          id, user_id: user.data.user!.id,
          name: encrypt(name || ''),
          amount, date, category,
          project_id: projectId, task_id: taskId,
          notes: encrypt(notes || ''),
          expense_data: extraData,
        };
      });
      const { error } = await client.from('expenses').upsert(data, { onConflict: 'user_id,id' });
      if (error) throw toError(error);
    }
  }

  // Save entire app data (for backup restore or normal save)
  // isRestore: when true, clears existing data and remaps all IDs (for restoring backups)
  // forceWrite: when true, ignored (kept for API compatibility)
  // Save entire app data (for backup restore or normal save)
  // isRestore: when true, clears existing data and remaps all IDs (for restoring backups)
  // forceWrite: when true, ignored (kept for API compatibility)
  static async saveAppData(appData: AppData, forceWrite = false, isRestore = false): Promise<void> {
    console.log('📦 saveAppData called:', {
      forceWrite,
      isRestore,
      hasClients: appData.clients?.length,
      hasTasks: appData.tasks?.length
    });

    const client = this.client;
    const { data: { user }, error: authError } = await client.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated. Please log in to save data.');
    }

    console.log('👤 Saving data for user:', user.id);

    try {
      // Only clear and remap when restoring from backup
      if (isRestore) {
        // IMPORTANT: Clear relevant tables first to ensure clean state
        await this.clearAllUserData();

        // With composite primary keys (user_id, id), each user has their own namespace
        // So we can safely keep original IDs from backup without conflicts
        console.log('🔄 Restoring data with original IDs (composite PK ensures isolation)');

        // Step 1: Save base entities first (no foreign key dependencies)
        await Promise.all([
          this.saveClients(appData.clients || []),
          this.saveCollaborators((appData as any).collaborators || []),
          this.saveCategories((appData as any).categories || []),
          this.saveSettings(appData.appSettings || {} as AppSettings),
        ]);

        // Step 2: Save entities that depend on clients/collaborators
        await Promise.all([
          this.saveProjects(appData.projects || []),
          this.saveQuoteTemplates((appData as any).quoteTemplates || []),
        ]);

        // Step 3: Save entities that depend on projects
        await Promise.all([
          this.saveTasks(appData.tasks || []),
          this.saveQuotes(appData.quotes || []),
        ]);

        // Step 4: Save entities that depend on tasks/quotes
        await Promise.all([
          this.saveWorkSessions(appData.workSessions || []),
          this.saveCollaboratorQuotes((appData as any).collaboratorQuotes || []),
          this.saveNotes((appData as any).notes || []),
          this.saveEvents((appData as any).events || []),
          this.saveFixedCosts((appData as any).fixedCosts || []),
          this.saveExpenses((appData as any).expenses || []),
        ]);

        console.log('✅ All restore data saved to Supabase successfully');
      } else {
        // Normal save operation (no clearing, no ID remapping)
        // Use upsert to update existing records
        await Promise.all([
          this.saveClients(appData.clients || []),
          this.saveCollaborators((appData as any).collaborators || []),
          this.saveCategories((appData as any).categories || []),
          this.saveSettings(appData.appSettings || {} as AppSettings),
        ]);

        await Promise.all([
          this.saveProjects(appData.projects || []),
          this.saveQuoteTemplates((appData as any).quoteTemplates || []),
        ]);

        await Promise.all([
          this.saveTasks(appData.tasks || []),
          this.saveQuotes(appData.quotes || []),
        ]);

        await Promise.all([
          this.saveWorkSessions(appData.workSessions || []),
          this.saveCollaboratorQuotes((appData as any).collaboratorQuotes || []),
          this.saveNotes((appData as any).notes || []),
          this.saveEvents((appData as any).events || []),
          this.saveFixedCosts((appData as any).fixedCosts || []),
          this.saveExpenses((appData as any).expenses || []),
        ]);

        console.log('✅ All data saved to Supabase successfully');
      }
    } catch (err) {
      console.error('Supabase save error:', err);
      throw new Error(`Failed to save data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Clear ALL user data from Supabase
  static async clearAllUserData(): Promise<void> {
    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    console.log('🧹 Starting full data wipe for user:', user.data.user.id);

    // Execute deletes in parallel batches to speed up
    // Order matters slightly for foreign keys if ON DELETE CASCADE isn't set, 
    // but usually with RLS andCASCADE it handles itself. 
    // Safe bet: delete leaf nodes first.

    const tables = [
      'tasks', 'work_sessions', 'collaborator_quotes',
      'notes', 'events', 'expenses', 'fixed_costs',
      'projects', 'quotes', 'quote_templates',
      'clients', 'categories', 'collaborators',
      'app_settings'
    ];

    // We can try Promise.all but Supabase limiting might be an issue. 
    // Sequential batches is safer.

    for (const table of tables) {
      try {
        await client.from(table).delete().neq('id', 'dummy'); // Delete all rows visible to user
      } catch (e) {
        console.warn(`Failed to clear table ${table}`, e);
      }
    }
  }

  static subscribeToChanges(callback: () => void) {
    const client = this.client;
    const channels: any[] = [];

    const tables = ['clients', 'projects', 'tasks', 'quotes', 'user_settings', 'work_sessions'];

    tables.forEach(table => {
      const channel = client
        .channel(`realtime:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          callback();
        })
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => client.removeChannel(channel));
    };
  }
  // Save single AI analysis
  static async saveAIAnalysis(analysis: AIAnalysis): Promise<void> {

    const client = this.client;
    const user = await client.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const data = {
      id: analysis.id,
      user_id: user.data.user.id,
      timestamp: analysis.timestamp,
      analysis: analysis.analysis
    };

    // We use insert because we want distinct history entries
    // The trigger will limit to 10 latest
    const { error } = await client.from('ai_analyses').insert(data);
    if (error) throw toError(error);
  }
}
