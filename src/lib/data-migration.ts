// Data Migration Utilities
// Handles conversion between old PouchDB format and current AppData format for Restore functionality
// Pure utility - no database dependencies

import type { AppData } from '@/lib/types';
import { initialAppData } from '@/lib/data';

export interface LegacyAppData {
    // Legacy PouchDB format inputs (snake_case)
    tasks?: any[];
    quotes?: any[];
    clients?: any[];
    projects?: any[];
    categories?: any[];
    appSettings?: any;
    notes?: any[];
    events?: any[];
    workSessions?: any[];
    expenses?: any[];
    fixedCosts?: any[];
    collaborators?: any[];
    quoteTemplates?: any[];
    collaboratorQuotes?: any[];
    aiAnalyses?: any[];
    aiProductivityAnalyses?: any[];

    // Legacy fields key mappings
    quote_templates?: any[];
    work_sessions?: any[];
    fixed_costs?: any[];
    collaborator_quotes?: any[];
    ai_analyses?: any[];
    ai_productivity_analyses?: any[];
    app_settings?: any;

    // AI/localStorage fields (to be restored to localStorage)
    aiPersistentData?: any;
    aiWritingPresets?: any;
    aiWritingHistory?: any;
    aiWritingVersions?: any;
    filterPresets?: any;
}

export class DataMigrationService {

    /**
     * Detect if imported JSON is in legacy PouchDB format
     */
    static isLegacyFormat(data: any): boolean {
        if (!data || typeof data !== 'object') return false;

        // Check for snake_case fields (legacy PouchDB)
        const legacyFields = [
            'quote_templates', 'work_sessions', 'fixed_costs',
            'collaborator_quotes', 'ai_analyses', 'app_settings'
        ];

        const hasLegacyFields = legacyFields.some(field => data.hasOwnProperty(field));

        // Check for old task structure
        const hasLegacyTaskStructure = data.tasks && data.tasks.length > 0 &&
            data.tasks[0] && (data.tasks[0].created_at || data.tasks[0].updated_at);

        return hasLegacyFields || hasLegacyTaskStructure;
    }

    /**
     * Check if data is missing projects field (intermediate legacy format)
     */
    static needsProjectsMigration(data: any): boolean {
        return data && typeof data === 'object' && !data.hasOwnProperty('projects') && data.tasks;
    }

    /**
     * Migrate intermediate format (no projects) to current format
     */
    static migrateToCurrentFormat(data: any): AppData {
        console.log('🔄 Migrating intermediate data to current format...');

        const projects: any[] = [];

        // Keep tasks as-is, sanitize dates
        const updatedTasks = (data.tasks || []).map((task: any) => {
            const getVal = (val: any) => val;
            return {
                ...task,
                startDate: task.startDate ? new Date(task.startDate) : new Date(),
                deadline: task.deadline ? new Date(task.deadline) : undefined,
            };
        });

        // Ensure required structure
        const migratedData: AppData = {
            ...initialAppData,
            tasks: updatedTasks,
            projects: projects,
            clients: data.clients || [],
            quotes: data.quotes || [],
            collaboratorQuotes: data.collaboratorQuotes || [],
            categories: data.categories || [],
            notes: data.notes || [],
            events: data.events || [],
            workSessions: data.workSessions || [],
            expenses: data.expenses || [],
            fixedCosts: data.fixedCosts || [],
            collaborators: data.collaborators || [],
            quoteTemplates: data.quoteTemplates || [],
            aiAnalyses: data.aiAnalyses || [],
            aiProductivityAnalyses: data.aiProductivityAnalyses || [],
            appSettings: {
                ...initialAppData.appSettings,
                ...(data.appSettings || {}),
            },
        };

        return migratedData;
    }

    /**
     * Migrate full legacy PouchDB dump to Supabase AppData
     */
    static migrateLegacyData(legacyData: LegacyAppData): AppData {
        console.log('🔄 Converting legacy PouchDB export to current format...');

        // Helper to standardise IDs
        const ensureId = (item: any, prefix: string, index: number): any => {
            if (!item) return item;
            const now = Date.now();
            const id = item.id || item._id || `${prefix}-${now}-${Math.random().toString(36).slice(2, 8)}-${index}`;
            return {
                ...item,
                id,
                _id: undefined, _rev: undefined, _deleted: undefined,
            };
        };

        // Convert snake_case to camelCase for dates and keys
        const convertItem = (item: any): any => {
            if (!item) return item;
            const converted = { ...item };

            const dateMap: Record<string, string> = {
                'created_at': 'createdAt', 'updated_at': 'updatedAt',
                'start_date': 'startDate', 'end_date': 'endDate',
                'deadline': 'deadline', 'valid_until': 'validUntil'
            };

            Object.entries(dateMap).forEach(([snake, camel]) => {
                if (converted[snake]) {
                    converted[camel] = converted[snake];
                    delete converted[snake];
                }
            });

            return converted;
        };

        // Map Tasks
        const tasks = (legacyData.tasks || []).map((task, index) => {
            const m = ensureId(convertItem(task), 'task', index);
            return {
                ...m,
                projectId: m.projectId || m.project_id,
                startDate: m.startDate ? new Date(m.startDate) : new Date(),
                deadline: m.deadline ? new Date(m.deadline) : undefined,
                // cleanup
                project_id: undefined, estimated_hours: undefined, actual_hours: undefined
            };
        });

        // Map Projects
        const projects = (legacyData.projects || []).map((project, index) => {
            const m = ensureId(convertItem(project), 'proj', index);
            return {
                ...m,
                clientId: m.clientId || m.client_id,
                startDate: m.startDate ? new Date(m.startDate) : undefined,
                endDate: m.endDate ? new Date(m.endDate) : undefined,
                tasks: [],
                client_id: undefined
            };
        });

        // Map Clients
        const clients = (legacyData.clients || []).map((c, i) => ensureId(convertItem(c), 'client', i));

        // Map Quotes
        const quotes = (legacyData.quotes || []).map((q, i) => {
            const m = ensureId(convertItem(q), 'quote', i);
            return {
                ...m,
                items: m.items || m.quote_items || [],
                clientId: m.clientId || m.client_id,
                quote_items: undefined, client_id: undefined
            };
        });

        // Basic collections mapping
        const mapCol = (arr: any[] | undefined, prefix: string) => (arr || []).map((x, i) => ensureId(convertItem(x), prefix, i));

        const workSessions = mapCol(legacyData.workSessions || legacyData.work_sessions, 'ws');
        const categories = mapCol(legacyData.categories, 'cat');
        const notes = mapCol(legacyData.notes, 'note');
        const events = mapCol(legacyData.events, 'evt');
        const expenses = mapCol(legacyData.expenses, 'exp');
        const fixedCosts = mapCol(legacyData.fixedCosts || legacyData.fixed_costs, 'fc');
        const collaborators = mapCol(legacyData.collaborators, 'collab');
        const quoteTemplates = mapCol(legacyData.quoteTemplates || legacyData.quote_templates, 'qt');
        const collaboratorQuotes = mapCol(legacyData.collaboratorQuotes || legacyData.collaborator_quotes, 'cq');
        const aiAnalyses = mapCol(legacyData.aiAnalyses || legacyData.ai_analyses, 'aia');
        const aiProductivityAnalyses = mapCol(legacyData.aiProductivityAnalyses || legacyData.ai_productivity_analyses, 'aipa');

        // App Settings
        let appSettings = legacyData.appSettings || legacyData.app_settings || initialAppData.appSettings;
        if (appSettings.theme && typeof appSettings.theme === 'string') {
            try { appSettings.theme = JSON.parse(appSettings.theme); } catch { }
        }

        const migratedData: AppData = {
            ...initialAppData,
            tasks, projects, clients, quotes, workSessions,
            categories, notes, events, expenses, fixedCosts,
            collaborators, quoteTemplates, collaboratorQuotes,
            aiAnalyses, aiProductivityAnalyses,
            appSettings
        };

        return migratedData;
    }
}
