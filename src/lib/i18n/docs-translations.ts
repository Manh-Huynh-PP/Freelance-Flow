export const docsTranslations = {
    en: {
        // Sidebar
        sidebar: {
            gettingStarted: "Getting Started",
            intro: "Introduction",
            cloneDeploy: "Clone & Deploy",

            userManual: "User Manual",
            dashboard: "Dashboard Overview",
            quotes: "Managing Quotes",
            analysis: "Project Analysis",
            widgets: "Widgets",
            shared: "Shared Views",
            backup: "Backup & Restore",

            theories: "View Theories",
            kanban: "Agile & Kanban",
            gantt: "Gantt Charts",
            eisenhower: "Eisenhower Matrix",
            pert: "PERT Analysis",
            pomodoro: "Pomodoro Technique",

            business: "Business Logic",
            financials: "Financial Calculations",
            timeTracking: "Productivity Analysis"
        },

        // Introduction page
        intro: {
            title: "Freelance Flow Documentation",
            description: "Technical documentation and user guide for the Freelance Flow application. This system allows freelancers to manage projects, finances, and client interactions.",
            whatIsTitle: "System Overview",
            whatIsDesc: "Freelance Flow is a dashboard application built with Next.js and Supabase. It integrates project management (Kanban, Gantt), time tracking (Pomodoro), and financial reporting into a single interface.",
            features: [
                { title: "Project Management", desc: "Tools for task organization using Kanban boards, Gantt charts, and Calendar views." },
                { title: "Financial Tracking", desc: "Modules for recording revenue, tracking expenses, and calculating profit margins." },
                { title: "Client Portal", desc: "Read-only views for sharing project status with external clients." },
                { title: "Productivity", desc: "Built-in timer and time-tracking utilities linked to specific tasks." }
            ],
            gettingStartedTitle: "Getting Started",
            gettingStartedDesc: "Select a path to begin using the system:",
            gettingStartedOptions: [
                {
                    type: "self-hosted",
                    title: "Self-Hosted Deployment",
                    desc: "Deploy Freelance Flow on your own infrastructure (VPS, Vercel, Docker).",
                    pros: [
                        "Complete data privacy & ownership",
                        "No subscription fees (Free Forever)",
                        "Full code customization access",
                        "Unlimited projects & storage"
                    ],
                    cons: [
                        "Requires technical setup (Node.js/Git)",
                        "Self-managed updates & backups",
                        "Server costs (AWS/Vercel/Supabase)"
                    ],
                    limit: "Requires developer knowledge",
                    link: "/docs/clone-and-deploy",
                    btnText: "View Deployment Guide"
                },
                {
                    type: "cloud",
                    title: "Use Existing App",
                    desc: "Start using the hosted version immediately without any setup.",
                    pros: [
                        "Instant access - Start in seconds",
                        "Automatic updates & maintenance",
                        "Zero technical knowledge required",
                        "Managed security & backups"
                    ],
                    cons: [
                        "Shared environment limitations",
                        "Standard features only",
                        "Potential usage quotas"
                    ],
                    limit: "Standard Free Tier Quotas",
                    link: "/login",
                    btnText: "Launch App Now"
                }
            ],
            keyFeaturesTitle: "System Requirements",
            keyFeatures: [
                { title: "Node.js", desc: "Runtime environment (v18+)" },
                { title: "Supabase", desc: "PostgreSQL database provider" },
                { title: "Browser", desc: "Modern web browsers (Chrome, Edge, Firefox, Safari)" }
            ],
            closingMessage: "Use the sidebar navigation to access detailed documentation for each module."
        },

        // Clone & Deploy page
        cloneAndDeploy: {
            title: "Clone & Deploy Guide",
            subtitle: "Set up your own instance of Freelance Flow",
            description: "This guide will walk you through the process of cloning the Freelance Flow repository and deploying it to your own environment.",

            prerequisitesTitle: "Prerequisites",
            prerequisitesDesc: "Before you begin, ensure you have the following installed:",
            prerequisites: [
                { name: "Node.js", version: "Version 18 or higher" },
                { name: "npm or yarn", version: "Package manager" },
                { name: "Git", version: "Version control system" }
            ],

            proTip: {
                title: "💡 Pro Tip: Use AI-Powered IDEs",
                desc: "Modern AI agents like **Antigravity** or IDEs like **Cursor**, **Windsurf**, (**VS Code**) often offer free tiers for their agentic coding features. These agents can **automatically execute terminal commands**, install dependencies, and configure environment variables for you, making the setup process significantly faster and error-free."
            },

            steps: [
                {
                    title: "Clone the Repository",
                    desc: "Open your terminal and run the following command to clone the repository:",
                    code: "git clone https://github.com/manhhuynh-designer/Freelance-Flow.git\ncd Freelance-Flow"
                },
                {
                    title: "Install Dependencies",
                    desc: "Install the project dependencies using npm:",
                    code: "npm install"
                },
                {
                    title: "Get Supabase Keys",
                    desc: "1. Create a new project at [supabase.com](https://supabase.com)\n2. Go to Project Settings > API.\n3. Copy `Project URL`, `anon public` key, and `service_role` key.",
                    code: "# No command needed, copying keys"
                },
                {
                    title: "Get Gemini API Key",
                    desc: "1. Go to [Google AI Studio](https://aistudio.google.com/)\n2. Create an API Key.\n3. Copy the key for `GOOGLE_GENAI_API_KEY`.",
                    code: "# No command needed, copying keys"
                },
                {
                    title: "Configure Environment Variables",
                    desc: "Create a `.env.local` file in the root directory and add the necessary environment variables. You can reference `.env.example` if provided.",
                    code: "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\nSUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key\nGOOGLE_GENAI_API_KEY=your_gemini_api_key\nNEXTAUTH_SECRET=your_secret_string"
                },
                {
                    title: "Run Development Server",
                    desc: "Start the local development server:",
                    code: "npm run dev"
                },
                {
                    title: "Build for Production",
                    desc: "To build the application for production, run:",
                    code: "npm run build"
                }
            ],

            deploymentTitle: "Deployment",
            deploymentDesc: "You can deploy this application to any platform that supports Next.js, such as Vercel, Netlify, or Docker.",
            vercelTitle: "Vercel (Recommended)",
            vercelSteps: [
                "Push your code to a GitHub repository.",
                "Import the project into Vercel.",
                "Add your environment variables.",
                "Click **Deploy**."
            ],

            openLocalhost: "Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.",

            troubleshootingTitle: "Troubleshooting",
            troubleshooting: [
                {
                    title: "Dependency Conflicts",
                    problem: "Errors during `npm install` related to peer dependencies.",
                    solution: "Try running `npm install --legacy-peer-deps` or ensure you are using Node.js v18+."
                },
                {
                    title: "Database Connection",
                    problem: "Application crashes on startup with database errors.",
                    solution: "Check your `.env.local` file. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct."
                },
                {
                    title: "Port Already in Use",
                    problem: "Error: `Port 3000 is already in use`.",
                    solution: "Kill the process using port 3000 or run on a different port: `npm run dev -- -p 3001`."
                }
            ]
        },

        // Manual - Dashboard
        manual: {
            dashboard: {
                title: "Dashboard Overview",
                subtitle: "Your central hub for project management",
                description: "The Dashboard is the main interface where you can view and manage all your tasks, projects, and activities. It provides a high-level view of your workspace and allows you to dive deep into specific details.",
                image: "/landing/screenshots/table-desktop.webp",

                sectionsTitle: "Main Dashboard Components",
                sections: [
                    {
                        title: "Sidebar (Left Navigation)",
                        desc: "Categorized menu for **Views** (Dashboard, Analysis), **Management** (Clients, Collaborators, Projects, Fixed Costs), and **Utilities** (Notes). Also contains Settings and Trash at the bottom.",
                        icon: "Sidebar"
                    },
                    {
                        title: "Top Header",
                        desc: "Displays current context title (e.g., 'Tasks'), **Pomodoro Timer** controls, and Quick Actions (Calendar, Add New).",
                        icon: "LayoutHeader"
                    },
                    {
                        title: "Workspace Toolbar",
                        desc: "Located above the task list. Contains **Status Filters** (Color dots), **Search Bar**, and the **View Mode Switcher** (Table, Kanban, etc.).",
                        icon: "MousePointerClick"
                    },
                    {
                        title: "Main Content Area",
                        desc: "The central area displaying your data. Shows tasks/projects according to the selected View Mode (Table list, Board cards, etc.).",
                        icon: "Maximize"
                    }
                ],

                viewModesTitle: "Available View Modes",
                viewModes: [
                    { name: "Table View", desc: "A detailed list view ideal for bulk editing and sorting tasks by various properties.", icon: "Table" },
                    { name: "Kanban Board", desc: "Visual workflow management with drag-and-drop cards organized by status columns.", icon: "Kanban" },
                    { name: "Calendar View", desc: "Schedule-focused view to see deadlines and tasks on a monthly/weekly timeline.", icon: "Calendar" },
                    { name: "Gantt Chart", desc: "Timeline view for project planning, showing task durations and dependencies.", icon: "GanttChart" },
                    { name: "Eisenhower Matrix", desc: "Priority matrix dividing tasks by Urgency and Importance for better decision making.", icon: "LayoutGrid" },
                    { name: "PERT Diagram", desc: "Network diagram to visualize task dependencies and critical path analysis.", icon: "Network" }
                ],

                navigationTitle: "Tips & Shortcuts",
                navigationTips: [
                    { text: "Double-click a **Status Color Icon** to instantly filter by that specific status.", icon: "MousePointer2" },
                    { text: "Collapse the sidebar to maximize screen real estate for complex views like Gantt.", icon: "PanelLeftClose" },
                    { text: "Drag and drop tasks in Kanban and Calendar views to quickly update status or dates.", icon: "Move" },
                    { text: "Customize column visibility in Table View via the 'Columns' dropdown.", icon: "Settings2" }
                ]
            },

            quotes: {
                title: "Quotes & Task Timeline",
                subtitle: "Manage proposals, milestones, and project financials",
                description: "A comprehensive module to handle the financial and scheduling aspects of your tasks. Create professional quotes, define project milestones, and track payments in one place.",

                // Quotes Section
                creatingTitle: "Creating a Quote",
                creatingSteps: [
                    {
                        title: "Initiate Quote",
                        desc: "Open a specific Task or Project and navigate to the 'Price Quote' tab.",
                        icon: "FilePlus"
                    },
                    {
                        title: "Add Sections",
                        desc: "Organize line items into logical groups (e.g., 'Design', 'Development') using the 'Add Section' button.",
                        icon: "LayoutList"
                    },
                    {
                        title: "Line Items",
                        desc: "Add specific deliverables with descriptions, quantities, and unit prices. The system auto-calculates totals.",
                        icon: "ListPlus"
                    },
                    {
                        title: "Review & Save",
                        desc: "Check the grand total, verify currency settings, and save the quote as a Draft.",
                        icon: "Save"
                    }
                ],

                statusesTitle: "Task & Quote Lifecycle",
                statuses: [
                    { name: "To Do", desc: "Initial stage. Task created, Quote being drafted. Ready to start.", icon: "Circle", color: "bg-purple-100 text-purple-800" },
                    { name: "In Progress", desc: "Active phase. Can track 'Planning', 'Development', or 'Quote Sent' via sub-statuses.", icon: "Timer", color: "bg-yellow-100 text-yellow-800" },
                    { name: "Done", desc: "Work completed. Mark as 'Delivered' or 'Paid' when finalized.", icon: "CheckCircle2", color: "bg-green-100 text-green-800" },
                    { name: "On Hold", desc: "Paused work due to blockers or client feedback.", icon: "PauseCircle", color: "bg-orange-100 text-orange-800" },
                    { name: "Archived", desc: "Closed tasks. Hidden from main views but preserved for history.", icon: "Archive", color: "bg-slate-100 text-slate-800" }
                ],

                // Timeline & Milestones
                timelineTitle: "Timeline & Milestones",
                timelineDesc: "Break down complex tasks into manageable milestones to track progress and link payments.",
                timelineSteps: [
                    {
                        title: "Create Milestone",
                        desc: "In the 'Timeline' tab, define key deliverables or phases (e.g., 'Phase 1 Delivery').",
                        icon: "Flag"
                    },
                    {
                        title: "Set Deadlines",
                        desc: "Assign specific due dates for each milestone to generate a Gantt chart view automatically.",
                        icon: "CalendarClock"
                    },
                    {
                        title: "Track Progress",
                        desc: "Mark milestones as 'Completed' as you finish them to update the overall Task progress.",
                        icon: "CheckSquare"
                    }
                ],

                // Payments
                paymentsTitle: "Payment Tracking",
                paymentsDesc: "Monitor financial inflows linked to your task milestones.",
                paymentSteps: [
                    {
                        title: "Link to Milestone",
                        desc: "Associate a payment amount with a specific milestone (e.g., 50% deposit upon Project Start).",
                        icon: "Link2"
                    },
                    {
                        title: "Update Status",
                        desc: "Track payment status: 'Pending', 'Overdue', or 'Paid' manualy or via integration.",
                        icon: "CreditCard"
                    },
                    {
                        title: "Payment Records",
                        desc: "Keep a history of all transaction dates and amounts for financial reporting.",
                        icon: "Receipt"
                    }
                ],

                templatesTitle: "Using Templates",
                templatesDesc: "Save recurring quote structures to speed up your workflow. Ideal for standard service packages.",
                templateSteps: [
                    "Build a quote with your standard sections and items.",
                    "Click the 'Save as Template' button in the toolbar.",
                    "Name your template (e.g., 'Web Development Standard').",
                    "Apply it to any new quote via the 'Load Template' dropdown."
                ],

                sharingTitle: "Sharing & Export",
                sharingOptions: [
                    { text: "Generate Public Link", desc: "Create a secure, read-only link for clients to view online.", icon: "Link" },
                    { text: "Export as PDF", desc: "Download a professional PDF Document for email attachments.", icon: "FileDown" },
                    { text: "Copy to Clipboard", desc: "Quickly copy the quote summary for chat or email bodies.", icon: "Copy" }
                ]
            },

            backup: {
                title: "Backup & Restore",
                subtitle: "Protect your data with regular backups",
                description: "Freelance Flow provides comprehensive backup and restore features to ensure your data is always safe. Access this feature in Settings > Data tab.",

                exportTitle: "Export Data",
                exportDesc: "Create a full backup of all your data for safekeeping:",
                exportFormats: [
                    {
                        name: "Excel Format (.xlsx)",
                        desc: "Human-readable spreadsheet with separate sheets for Tasks, Clients, Quotes, etc. Easy to view and edit in Excel or Google Sheets.",
                        recommended: true
                    },
                    {
                        name: "JSON Format (.json)",
                        desc: "Raw data format, ideal for technical users or automated workflows. Preserves all data exactly as stored."
                    }
                ],

                importTitle: "Import Data",
                importDesc: "Restore data from a previously exported backup file:",
                importModes: [
                    {
                        name: "Merge Mode",
                        desc: "Combines imported data with existing data. Useful when transferring data between devices without losing current work.",
                        icon: "Merge"
                    },
                    {
                        name: "Overwrite Mode",
                        desc: "Replaces all existing data with imported data. Use when restoring from a full backup or starting fresh.",
                        icon: "Replace"
                    }
                ],

                autoBackupTitle: "Automatic Backups",
                autoBackupDesc: "The system automatically protects your data:",
                autoBackupFeatures: [
                    {
                        name: "24-Hour Auto Backup",
                        desc: "Data is automatically backed up every 24 hours to local browser storage."
                    },
                    {
                        name: "Backup History",
                        desc: "Up to 5 recent backups are kept, allowing you to restore from any previous version."
                    },
                    {
                        name: "Data Recovery",
                        desc: "If main data is lost (e.g., after clearing browser data), the system attempts automatic recovery from backup."
                    }
                ],

                dangerZoneTitle: "Danger Zone",
                dangerZoneDesc: "Clear all data permanently. This action cannot be undone!",
                clearOptions: [
                    {
                        name: "Clear Main Data Only",
                        desc: "Removes tasks, clients, quotes, etc. but keeps backup history for potential recovery."
                    },
                    {
                        name: "Clear Data and Backups",
                        desc: "Removes everything including backup history. Fresh start with no recovery option."
                    }
                ],

                tipsTitle: "Best Practices",
                tips: [
                    "Export a backup before major changes or device switches",
                    "Use Excel format for easy viewing and sharing with others",
                    "Keep backups in cloud storage (Google Drive, Dropbox) for extra safety",
                    "Test restore on a new browser to verify backup integrity"
                ]
            },
            analysis: {
                title: "Project Analysis",
                subtitle: "Understand your business performance",
                description: "The Analysis feature provides deep insights into project performance, financial status, and work productivity, helping you make data-driven decisions.",

                typesTitle: "Analysis Types",
                analysisTypes: [
                    {
                        title: "Financial Analysis",
                        subtitle: "Revenue & Costs",
                        desc: "Track financial health with detailed reports on revenue, expenses, and profit margins over time.",
                        metrics: [
                            { label: "Revenue Trend", desc: "Line chart showing growth.", icon: "TrendingUp" },
                            { label: "Cost Structure", desc: "Pie chart analyzing cost categories.", icon: "PieChart" },
                            { label: "Profit Margin", desc: "Calculate net profit per project.", icon: "Percent" },
                            { label: "Run Rate", desc: "Annual revenue forecast based on current data.", icon: "Target" }
                        ],
                        icon: "Banknote"
                    },
                    {
                        title: "Project Metrics",
                        subtitle: "Progress & Status",
                        desc: "Monitor project health through completion rates, status distribution, and execution speed.",
                        metrics: [
                            { label: "Completion Rate", desc: "% of work done vs total.", icon: "Activity" },
                            { label: "Status Distribution", desc: "Bar chart of tasks by status.", icon: "BarChart3" },
                            { label: "Time Tracking", desc: "Compare Estimated vs Actual time.", icon: "Clock" },
                            { label: "Burndown", desc: "Remaining workload over time.", icon: "ArrowDownCircle" }
                        ],
                        icon: "Kanban"
                    },
                    {
                        title: "Productivity",
                        subtitle: "Efficiency & Focus",
                        desc: "Measure personal and team productivity through attendance data and Pomodoro statistics.",
                        metrics: [
                            { label: "Tasks Completed", desc: "Output by Day/Week/Month.", icon: "CheckSquare" },
                            { label: "Focus Time", desc: "Total deep work hours.", icon: "BrainCircuit" },
                            { label: "Pomodoro Stats", desc: "Number of work sessions completed.", icon: "Timer" },
                            { label: "Priority", desc: "Distribution of important tasks.", icon: "Layers" }
                        ],
                        icon: "Zap"
                    }
                ],

                aiTitle: "AI-Powered Analysis",
                aiDesc: "Use artificial intelligence to detect hidden patterns and receive actionable recommendations.",
                aiSteps: [
                    { text: "Select a time period (e.g., Last 30 days).", icon: "CalendarRange" },
                    { text: "Click 'Analyze with AI' button.", icon: "Sparkles" },
                    { text: "View insights on trends and risks.", icon: "Lightbulb" },
                    { text: "Apply suggestions to improve workflow.", icon: "Rocket" }
                ],
                aiFeatures: [
                    { name: "Trend Detection", desc: "Identify recurring work habits.", icon: "LineChart" },
                    { name: "Risk Warnings", desc: "Alerts for potential delays or overspending.", icon: "AlertTriangle" },
                    { name: "Smart Forecasts", desc: "Estimate completion dates based on historical speed.", icon: "Radar" }
                ]
            },

            widgets: {
                title: "Dashboard Widgets",
                subtitle: "Customize your personal workspace",
                description: "Widgets provide compact, interactive views of your most important data. Pin them to your dashboard to grasp key information instantly.",

                featuresTitle: "Available Widgets",
                features: [
                    {
                        title: "Pomodoro Timer",
                        desc: "Focus timer in header with 25m work / 5m break cycles.",
                        features: ["Header Integration", "Focus/Break Modes", "One-touch Start"],
                        icon: "Timer"
                    },
                    {
                        title: "Sticky Notes",
                        desc: "Quick notepad in sidebar for temporary content.",
                        features: ["Always Accessible", "Auto-save", "Text Only"],
                        icon: "StickyNote"
                    },
                    {
                        title: "Quick Calculator",
                        desc: "Built-in calculator within Task create/edit forms.",
                        features: ["Basic Operations", "In-form Access", "Quick Calc"],
                        icon: "Calculator"
                    },
                    {
                        title: "Work Timer",
                        desc: "Check-in / Check-out system in header to track total daily work hours.",
                        features: ["Session Tracking", "Daily Summary", "Status Indicator"],
                        icon: "Clock"
                    },
                    {
                        title: "AI Quote Suggestion",
                        desc: "Smart price suggestions based on job description.",
                        features: ["Context Aware", "Historical Data", "1-Click Apply"],
                        icon: "Sparkles"
                    }
                ],

                managementTitle: "Widget Locations",
                managementSteps: [
                    {
                        title: "Header Area",
                        desc: "Find Pomodoro Timer and Work Timer (Check-in) at the top right corner.",
                        icon: "Layout"
                    },
                    {
                        title: "Sidebar",
                        desc: "Sticky Notes widget is pinned to the right sidebar for easy access.",
                        icon: "Sidebar"
                    },
                    {
                        title: "Task Form",
                        desc: "Find Calculator and AI icon buttons inside task edit dialogs.",
                        icon: "Edit3"
                    }
                ],

                tipsTitle: "Usage Tips",
                tips: [
                    { text: "Use Pomodoro for deep work sessions to avoid burnout.", icon: "Timer" },
                    { text: "Check-in at the start of your day for accurate attendance tracking.", icon: "CheckCircle" },
                    { text: "Use Sticky Notes to save temporary IDs or phone numbers.", icon: "StickyNote" }
                ]
            },

            shared: {
                title: "Client Sharing",
                subtitle: "Professional quote and timeline sharing",
                description: "Share quotes and project timelines with clients in various formats. Access the Share feature from any task detail dialog.",

                methodsTitle: "Sharing Formats",
                methods: [
                    {
                        title: "Share Link",
                        desc: "Generate a secure, read-only link for clients to view online. Interactive and live.",
                        icon: "Link"
                    },
                    {
                        title: "Share PDF",
                        desc: "Download quote and timeline as a professional PDF for email attachments.",
                        icon: "FileDown"
                    },
                    {
                        title: "Share Image",
                        desc: "Copy quote or timeline as an image to clipboard for quick sharing.",
                        icon: "Image"
                    }
                ],

                stepsTitle: "How to Share",
                steps: [
                    {
                        title: "Open Task Dialog",
                        desc: "Click on any task to open its detail dialog.",
                        icon: "MousePointerClick"
                    },
                    {
                        title: "Click Share Button",
                        desc: "Find and click the 'Share' button in the task detail dialog.",
                        icon: "Share2"
                    },
                    {
                        title: "Configure View",
                        desc: "Select display options: choose which sections to include in the shared view.",
                        icon: "Settings"
                    },
                    {
                        title: "Select Format",
                        desc: "Choose your preferred format: Link (live), PDF (download), or Image (copy).",
                        icon: "ArrowRight"
                    }
                ],

                clientViewTitle: "Shared Content Features",
                clientFeatures: [
                    { text: "Professional quote presentation", icon: "Briefcase" },
                    { text: "Visual timeline included", icon: "Calendar" },
                    { text: "No login required for clients", icon: "Unlock" },
                    { text: "Mobile-friendly display", icon: "Smartphone" }
                ]
            }
        },

        // Theories
        theories: {
            kanban: {
                title: "Kanban Method",
                subtitle: "Visual workflow management",
                description: "Kanban is a visual project management method that helps you visualize work, limit work-in-progress, and maximize efficiency. Filter columns by clicking color-coded status buttons.",

                principlesTitle: "Core Principles",
                principles: [
                    {
                        title: "Visualize Work",
                        desc: "Make all work visible on a board with columns representing different stages."
                    },
                    {
                        title: "Limit WIP",
                        desc: "Limit work-in-progress to prevent overload and improve focus."
                    },
                    {
                        title: "Manage Flow",
                        desc: "Monitor and optimize the flow of work through the system."
                    },
                    {
                        title: "Make Policies Explicit",
                        desc: "Clearly define how work moves between stages."
                    }
                ],

                usageTitle: "Using Kanban in Freelance Flow",
                usageSteps: [
                    "Switch to Kanban view from the sidebar",
                    "Filter columns by clicking color-coded status filter buttons",
                    "Drag and drop tasks between status columns",
                    "Customize columns in Settings > Statuses",
                    "Add sub-statuses for more granular tracking"
                ],

                tipsTitle: "Best Practices",
                tips: [
                    "Keep your board organized and up-to-date",
                    "Set WIP limits for each column",
                    "Review and update regularly",
                    "Use colors and labels for quick identification"
                ]
            },

            gantt: {
                title: "Gantt Charts",
                subtitle: "Timeline-based project planning",
                description: "Gantt charts provide a visual timeline of your project, showing task durations, dependencies, and progress. Also used when creating timelines for tasks.",

                componentsTitle: "Gantt Chart Components",
                components: [
                    { name: "Task Bars", desc: "Horizontal bars representing task duration" },
                    { name: "Timeline", desc: "Date scale showing project timeline" },
                    { name: "Dependencies", desc: "Lines connecting related tasks" },
                    { name: "Milestones", desc: "Key project checkpoints" }
                ],

                usageTitle: "Using Gantt View",
                usageSteps: [
                    "Switch to Gantt view from the sidebar",
                    "Set start and end dates for tasks",
                    "Drag task bars to adjust schedules",
                    "View project timeline and progress"
                ],

                benefitsTitle: "Benefits",
                benefits: [
                    "Clear visualization of project timeline",
                    "Easy identification of scheduling conflicts",
                    "Better resource allocation",
                    "Track project progress at a glance"
                ]
            },

            eisenhower: {
                title: "Eisenhower Matrix",
                subtitle: "Priority-based task management",
                description: "The Eisenhower Matrix helps you prioritize tasks by categorizing them based on urgency and importance.",
                note: "In other app views, urgency and importance levels are represented by Flag icons with corresponding colors. Color sets can be customized in settings.",

                quadrantsTitle: "The Four Quadrants",
                quadrants: [
                    {
                        name: "DO (Urgent & Important)",
                        desc: "Critical tasks that require immediate attention. Do these first.",
                        color: "Red"
                    },
                    {
                        name: "DECIDE (Not Urgent & Important)",
                        desc: "Important tasks that can be scheduled. Plan time for these.",
                        color: "Blue"
                    },
                    {
                        name: "DELEGATE (Urgent & Not Important)",
                        desc: "Tasks that need to be done soon but can be delegated to others.",
                        color: "Yellow"
                    },
                    {
                        name: "DELETE (Not Urgent & Not Important)",
                        desc: "Low-value tasks that should be eliminated or minimized.",
                        color: "Gray"
                    }
                ],

                usageTitle: "Using the Matrix",
                usageSteps: [
                    "Switch to Eisenhower view from the sidebar",
                    "Drag tasks into the appropriate quadrant",
                    "Set maximum tasks per quadrant in Settings",
                    "Review and adjust priorities regularly"
                ],

                tipsTitle: "Prioritization Tips",
                tips: [
                    "Be honest about what's truly urgent and important",
                    "Don't let the urgent crowd out the important",
                    "Regularly review and declutter the DELETE quadrant",
                    "Focus on completing DO tasks before moving to others"
                ]
            },

            pert: {
                title: "PERT Analysis",
                subtitle: "Project evaluation and review technique",
                description: "PERT is a project management method used to analyze and represent the tasks involved in completing a project through network diagrams.",

                componentsTitle: "Key Components",
                components: [
                    { name: "Nodes", desc: "Represent events or milestones in the project", icon: "Circle" },
                    { name: "Edges", desc: "Represent tasks or activities between events", icon: "GitBranch" },
                    { name: "Critical Path", desc: "Longest sequence determining minimum completion time", icon: "TrendingUp" }
                ],

                usageTitle: "Using PERT in Freelance Flow",
                usageSteps: [
                    "Switch to PERT view from the sidebar",
                    "View tasks arranged by dependencies",
                    "Identify the critical path of your project",
                    "Optimize schedule based on analysis"
                ],

                benefitsTitle: "Benefits",
                benefits: [
                    "Clear visualization of task dependencies",
                    "Identify critical tasks affecting timeline",
                    "More accurate completion time estimates",
                    "Detect potential bottlenecks in projects"
                ],

                tipsTitle: "Best Practices",
                tips: [
                    "Clearly define dependencies between tasks",
                    "Focus on optimizing tasks on critical path",
                    "Update diagram when project changes",
                    "Use in combination with Gantt for comprehensive management"
                ]
            },

            pomodoro: {
                title: "Pomodoro Technique",
                subtitle: "Effective time management method",
                description: "The Pomodoro Technique uses a timer to break work into focused intervals (traditionally 25 minutes), separated by short breaks to maximize productivity.",

                cycleTitle: "Standard Pomodoro Cycle",
                cycle: [
                    { duration: "25 min", desc: "Focused work (1 Pomodoro)", icon: "Timer" },
                    { duration: "5 min", desc: "Short break", icon: "Coffee" },
                    { duration: "15-30 min", desc: "Long break (after 4 Pomodoros)", icon: "Armchair" }
                ],

                usageTitle: "Using Pomodoro in Freelance Flow",
                usageSteps: [
                    "Set estimated time for task (number of Pomodoros)",
                    "Start timer and work with focus",
                    "Take a break when timer ends",
                    "Track completed Pomodoros"
                ],

                benefitsTitle: "Benefits",
                benefits: [
                    { title: "Increased Focus", desc: "Short intervals easier to maintain concentration", icon: "Focus" },
                    { title: "Reduced Fatigue", desc: "Regular breaks prevent burnout", icon: "Battery" },
                    { title: "Better Estimation", desc: "Learn to estimate time more accurately", icon: "Target" },
                    { title: "Boost Productivity", desc: "Sense of urgency drives efficiency", icon: "Zap" }
                ],

                tipsTitle: "Best Practices",
                tips: [
                    "Eliminate all distractions during Pomodoro",
                    "Don't break Pomodoro - complete or start over",
                    "Record progress after each Pomodoro",
                    "Adjust time to suit you (25 minutes is standard)",
                    "Use break time to truly relax"
                ],

                applicationTitle: "Application to Freelance Work",
                applications: [
                    "Use for high-concentration work (coding, design)",
                    "Track actual working time for projects",
                    "Improve quote accuracy based on real data",
                    "Balance between work and rest"
                ]
            }
        },

        // Business Logic
        business: {
            financials: {
                title: "Financial Calculations",
                subtitle: "Understanding your business metrics",
                description: "Freelance Flow automatically calculates key financial metrics to help you understand your business performance.",

                metricsTitle: "Key Financial Metrics",
                metrics: [
                    {
                        name: "Revenue",
                        formula: "Sum of all paid quote grand totals",
                        desc: "Total income from tasks with quotes marked as 'Paid'. Click to see detailed breakdown by task/client."
                    },
                    {
                        name: "Costs",
                        formula: "Collaborator costs + Fixed costs (paid)",
                        desc: "Total costs including collaborator payments and expenses with 'Paid' status."
                    },
                    {
                        name: "Profit",
                        formula: "Revenue - Costs",
                        desc: "Net profit after deducting all paid expenses from received revenue."
                    },
                    {
                        name: "Future Revenue",
                        formula: "Sum of unpaid quote totals",
                        desc: "Expected income from quotes that are not yet paid. Scheduled payments awaiting completion."
                    },
                    {
                        name: "Lost Revenue",
                        formula: "Sum of on-hold task quote totals",
                        desc: "Potential income from tasks marked as 'On Hold'. Revenue that may be recovered or lost."
                    },
                    {
                        name: "Fixed Costs",
                        formula: "Recurring costs × period",
                        desc: "Overhead expenses (subscriptions, rent, etc.) calculated for the selected time period."
                    }
                ],

                chartsTitle: "Financial Charts",
                chartsDesc: "The Financial Insights section provides visual analytics through interactive charts:",
                charts: [
                    {
                        name: "Monthly Revenue",
                        desc: "Bar chart showing revenue trends over time, helping you identify peak earning periods."
                    },
                    {
                        name: "Profit Trend",
                        desc: "Line chart tracking your profit margins month by month for performance analysis."
                    },
                    {
                        name: "Top Clients",
                        desc: "Ranking chart of your highest-paying clients based on total quote value."
                    }
                ],

                aiAnalysisTitle: "AI Business Analysis",
                aiAnalysisDesc: "Leverage AI to get intelligent insights about your business performance:",
                aiFeatures: [
                    {
                        name: "One-Click Analysis",
                        desc: "Click 'Analyze with AI' button to generate comprehensive business insights instantly."
                    },
                    {
                        name: "Trend Detection",
                        desc: "AI identifies patterns in your revenue, costs, and profit over the selected time period."
                    },
                    {
                        name: "Smart Recommendations",
                        desc: "Get actionable suggestions to improve profitability and optimize your workflow."
                    },
                    {
                        name: "Risk Alerts",
                        desc: "AI warns about potential issues like declining margins or overdue payments."
                    }
                ],

                tipsTitle: "Financial Management Tips",
                tips: [
                    "Regularly update your quotes and expenses",
                    "Track fixed costs separately from project costs",
                    "Use AI analysis to identify trends and opportunities",
                    "Review charts monthly to track performance"
                ]
            },

            productivityAnalysis: {
                title: "Productivity Analysis",
                subtitle: "Track work patterns and optimize performance",
                description: "The Productivity Analysis dashboard in Analysis section helps you understand your work patterns, track deadlines, and improve efficiency through data-driven insights.",

                workTimeTitle: "Work Time Statistics",
                workTimeDesc: "Track your work hours and focus time to understand productivity patterns:",
                workTimeMetrics: [
                    {
                        name: "Total Work Hours",
                        desc: "Sum of all logged work hours in the selected period, including manual entries and timer sessions."
                    },
                    {
                        name: "Total Focus Hours",
                        desc: "Hours spent in focused work sessions (Pomodoro timer). Key indicator of deep work quality."
                    },
                    {
                        name: "Pomodoros Done",
                        desc: "Number of completed Pomodoro sessions. Each session represents 25 minutes of uninterrupted focus."
                    },
                    {
                        name: "Daily Breakdown Chart",
                        desc: "Visual stacked bar chart showing work hours vs focus hours for each day in the period."
                    }
                ],

                taskAnalyticsTitle: "Task Analytics",
                taskAnalyticsDesc: "Analyze task distribution and trends to optimize your workflow:",
                taskAnalyticsFeatures: [
                    {
                        name: "Distribution Chart",
                        desc: "Pie chart showing task breakdown by status, client, or category. Helps identify where effort is concentrated."
                    },
                    {
                        name: "Trend Analysis",
                        desc: "Line chart showing task creation trends over time. Identify peak periods and workload patterns."
                    },
                    {
                        name: "Group By Options",
                        desc: "Switch between Status, Client, Category, or Eisenhower quadrant views for different perspectives."
                    },
                    {
                        name: "Summary Stats",
                        desc: "Quick overview showing active, near deadline, and overdue task counts."
                    }
                ],

                deadlineAlertsTitle: "Deadline Alerts",
                deadlineAlertsDesc: "Stay on top of upcoming deadlines with intelligent risk assessment:",
                deadlineFeatures: [
                    {
                        name: "Risk Assessment",
                        desc: "Tasks are color-coded by deadline risk: Critical (red), High (orange), Medium (yellow), Low (green)."
                    },
                    {
                        name: "Quick Actions",
                        desc: "Change task status or extend deadlines directly from the alerts card without opening the task."
                    },
                    {
                        name: "Upcoming Deadlines",
                        desc: "List of tasks with approaching deadlines sorted by urgency, showing days remaining."
                    }
                ],

                aiInsightsTitle: "AI Insights",
                aiInsightsDesc: "Get intelligent recommendations based on your data:",
                aiInsightsFeatures: [
                    {
                        name: "Pattern Detection",
                        desc: "AI analyzes work patterns, focus ratios, and task completion rates to identify trends."
                    },
                    {
                        name: "Actionable Recommendations",
                        desc: "Receive specific suggestions to improve productivity, reduce risks, and optimize workflow."
                    },
                    {
                        name: "Severity Levels",
                        desc: "Insights are categorized as Critical, High, Medium, or Low based on business impact."
                    }
                ]
            }
        }
    },

    vi: {
        // Sidebar
        sidebar: {
            gettingStarted: "Bắt Đầu",
            intro: "Giới thiệu",
            cloneDeploy: "Clone & Deploy",

            userManual: "Hướng Dẫn Sử Dụng",
            dashboard: "Tổng Quan Dashboard",
            quotes: "Quản Lý Báo Giá",
            analysis: "Phân Tích Dự Án",
            widgets: "Widgets",
            shared: "Chế Độ Xem Chia Sẻ",
            backup: "Sao Lưu & Khôi Phục",

            theories: "Lý Thuyết",
            kanban: "Agile & Kanban",
            gantt: "Biểu Đồ Gantt",
            eisenhower: "Ma Trận Eisenhower",
            pert: "Phân Tích PERT",
            pomodoro: "Kỹ Thuật Pomodoro",

            business: "Nghiệp Vụ",
            financials: "Tính Toán Tài Chính",
            timeTracking: "Phân Tích Năng Suất"
        },

        // Trang giới thiệu
        intro: {
            title: "Tài liệu Freelance Flow",
            description: "Tài liệu kỹ thuật và hướng dẫn sử dụng cho ứng dụng Freelance Flow. Hệ thống này cho phép freelancer quản lý dự án, tài chính và tương tác với khách hàng.",
            whatIsTitle: "Tổng Quan Hệ Thống",
            whatIsDesc: "Freelance Flow là ứng dụng dashboard được xây dựng với Next.js và Supabase. Nó tích hợp quản lý dự án (Kanban, Gantt), theo dõi thời gian (Pomodoro) và báo cáo tài chính vào một giao diện duy nhất.",
            features: [
                { title: "Quản Lý Dự Án", desc: "Công cụ tổ chức công việc sử dụng bảng Kanban, biểu đồ Gantt và xem Lịch." },
                { title: "Theo Dõi Tài Chính", desc: "Module ghi nhận doanh thu, theo dõi chi phí và tính toán biên lợi nhuận." },
                { title: "Cổng Khách Hàng", desc: "Chế độ xem (read-only) để chia sẻ trạng thái dự án với khách hàng bên ngoài." },
                { title: "Năng Suất", desc: "Tiện ích đồng hồ đếm ngược và theo dõi thời gian tích hợp sẵn cho từng nhiệm vụ." }
            ],
            gettingStartedTitle: "Bắt Đầu",
            gettingStartedDesc: "Chọn một lộ trình để bắt đầu sử dụng hệ thống:",
            gettingStartedOptions: [
                {
                    type: "self-hosted",
                    title: "Triển Khai Tự Host",
                    desc: "Triển khai Freelance Flow trên hạ tầng của riêng bạn (VPS, Vercel, Docker).",
                    pros: [
                        "Dữ liệu riêng tư & quyền sở hữu hoàn toàn",
                        "Không phí thuê bao (Miễn phí mãi mãi)",
                        "Quyền truy cập và tùy chỉnh mã nguồn",
                        "Không giới hạn dự án & lưu trữ"
                    ],
                    cons: [
                        "Cần thiết lập kỹ thuật (Node.js/Git)",
                        "Tự quản lý cập nhật & sao lưu",
                        "Chi phí máy chủ tự chi trả"
                    ],
                    limit: "Yêu cầu kiến thức lập trình",
                    link: "/docs/clone-and-deploy",
                    btnText: "Xem Hướng Dẫn"
                },
                {
                    type: "cloud",
                    title: "Sử Dụng App Có Sẵn",
                    desc: "Bắt đầu sử dụng phiên bản host sẵn ngay lập tức mà không cần cài đặt.",
                    pros: [
                        "Truy cập ngay - Bắt đầu sau vài giây",
                        "Cập nhật & bảo trì tự động",
                        "Không cần kiến thức kỹ thuật",
                        "Bảo mật & sao lưu được quản lý"
                    ],
                    cons: [
                        "Hạn chế của môi trường chia sẻ",
                        "Chỉ có các tính năng tiêu chuẩn",
                        "Có thể có giới hạn mức sử dụng (Quota)"
                    ],
                    limit: "Giới hạn gói Miễn phí tiêu chuẩn",
                    link: "/login",
                    btnText: "Mở Ứng Dụng Ngay"
                }
            ],
            keyFeaturesTitle: "Yêu Cầu Hệ Thống",
            keyFeatures: [
                { title: "Node.js", desc: "Môi trường thực thi (v18+)" },
                { title: "Supabase", desc: "Nhà cung cấp cơ sở dữ liệu PostgreSQL" },
                { title: "Trình Duyệt", desc: "Các trình duyệt web hiện đại (Chrome, Edge, Firefox, Safari)" }
            ],
            closingMessage: "Sử dụng thanh điều hướng bên trái để truy cập tài liệu chi tiết cho từng module."
        },

        // Trang Clone & Deploy
        cloneAndDeploy: {
            title: "Hướng dẫn Clone & Deploy",
            subtitle: "Thiết lập phiên bản Freelance Flow của riêng bạn",
            description: "Hướng dẫn này sẽ hướng dẫn bạn quy trình clone repository Freelance Flow và deploy lên môi trường của bạn.",

            prerequisitesTitle: "Yêu cầu",
            prerequisitesDesc: "Trước khi bắt đầu, đảm bảo bạn đã cài đặt:",
            prerequisites: [
                { name: "Node.js", version: "Phiên bản 18 trở lên" },
                { name: "npm hoặc yarn", version: "Trình quản lý package" },
                { name: "Git", version: "Hệ thống quản lý phiên bản" }
            ],

            proTip: {
                title: "💡 Mẹo Chuyên Nghiệp: Dùng IDE hỗ trợ AI",
                desc: "Các AI Agent hiện đại như **Antigravity** hoặc IDE như **Cursor**, **Windsurf**, (**VS Code**) thường cung cấp gói miễn phí cho tính năng agentic coding. Các agent này có thể **tự động chạy lệnh terminal**, cài đặt dependencies và cấu hình biến môi trường giúp bạn, làm cho quá trình cài đặt nhanh và chính xác hơn nhiều."
            },

            steps: [
                {
                    title: "Clone Repository",
                    desc: "Mở terminal và chạy lệnh sau để clone repository:",
                    code: "git clone https://github.com/manhhuynh-designer/Freelance-Flow.git\ncd Freelance-Flow"
                },
                {
                    title: "Cài đặt Dependencies",
                    desc: "Cài đặt các dependencies của dự án bằng npm:",
                    code: "npm install"
                },
                {
                    title: "Lấy Khóa Supabase",
                    desc: "1. Tạo dự án mới tại [supabase.com](https://supabase.com)\n2. Vào Project Settings > API.\n3. Copy `Project URL`, `anon public` key, và `service_role` key.",
                    code: "# Không cần lệnh, copy keys"
                },
                {
                    title: "Lấy Khóa Gemini API",
                    desc: "1. Truy cập [Google AI Studio](https://aistudio.google.com/)\n2. Tạo API Key mới.\n3. Copy key cho biến `GOOGLE_GENAI_API_KEY`.",
                    code: "# Không cần lệnh, copy keys"
                },
                {
                    title: "Cấu hình Biến Môi trường",
                    desc: "Tạo file `.env.local` trong thư mục gốc và thêm các biến môi trường cần thiết. Bạn có thể tham khảo `.env.example` nếu có.",
                    code: "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\nSUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key\nGOOGLE_GENAI_API_KEY=your_gemini_api_key\nNEXTAUTH_SECRET=your_secret_string"
                },
                {
                    title: "Chạy Development Server",
                    desc: "Khởi động server development local:",
                    code: "npm run dev"
                },
                {
                    title: "Build cho Production",
                    desc: "Để build ứng dụng cho production, chạy:",
                    code: "npm run build"
                }
            ],

            deploymentTitle: "Deployment",
            deploymentDesc: "Bạn có thể deploy ứng dụng này lên bất kỳ nền tảng nào hỗ trợ Next.js, như Vercel, Netlify, hoặc Docker.",
            vercelTitle: "Vercel (Khuyến nghị)",
            vercelSteps: [
                "Push code của bạn lên GitHub repository.",
                "Import dự án vào Vercel.",
                "Thêm các biến môi trường.",
                "Click **Deploy**."
            ],

            openLocalhost: "Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.",

            troubleshootingTitle: "Xử lý Sự cố",
            troubleshooting: [
                {
                    title: "Xung đột Dependencies",
                    problem: "Lỗi trong quá trình `npm install` liên quan đến peer dependencies.",
                    solution: "Thử chạy `npm install --legacy-peer-deps` hoặc đảm bảo bạn đang sử dụng Node.js v18+."
                },
                {
                    title: "Kết nối Database",
                    problem: "Ứng dụng bị crash khi khởi động với lỗi database.",
                    solution: "Kiểm tra file `.env.local`. Đảm bảo `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` chính xác."
                },
                {
                    title: "Cổng đã được sử dụng",
                    problem: "Lỗi: `Port 3000 is already in use`.",
                    solution: "Tắt tiến trình đang sử dụng port 3000 hoặc chạy trên port khác: `npm run dev -- -p 3001`."
                }
            ]
        },

        // Manual - Dashboard
        manual: {
            dashboard: {
                title: "Tổng Quan Dashboard",
                subtitle: "Trung tâm quản lý dự án của bạn",
                description: "Dashboard là giao diện chính nơi bạn có thể xem và quản lý tất cả các công việc, dự án và hoạt động của mình. Nó cung cấp cái nhìn tổng quan về không gian làm việc và cho phép bạn đi sâu vào chi tiết cụ thể.",
                image: "/landing/screenshots/table-desktop.webp",

                sectionsTitle: "Các Thành Phần Chính",
                sections: [
                    {
                        title: "Sidebar (Menu Bên Trái)",
                        desc: "Menu phân loại gồm **Chế độ xem** (Bảng điều khiển, Phân tích), **Quản lý** (Khách hàng, Cộng tác viên, Projects...) và **Tiện ích** (Ghi chú). Cài đặt và Thùng rác nằm dưới cùng.",
                        icon: "Sidebar"
                    },
                    {
                        title: "Header (Thanh Trên Cùng)",
                        desc: "Hiển thị tiêu đề (ví dụ: 'Tasks'), bộ điều khiển **Đồng hồ Pomodoro**, và các Thao tác nhanh (Lịch, Thêm mới, Tải xuống).",
                        icon: "LayoutHeader"
                    },
                    {
                        title: "Thanh Công Cụ (Toolbar)",
                        desc: "Nằm ngay trên danh sách công việc. Bao gồm **Bộ lọc trạng thái** (các chấm màu), **Thanh tìm kiếm**, và menu **Chế độ xem** (Bảng, Kanban...).",
                        icon: "MousePointerClick"
                    },
                    {
                        title: "Khu Vực Nội Dung Chính",
                        desc: "Nơi hiển thị dữ liệu chính. Hiển thị danh sách công việc hoặc dự án tùy theo Chế độ xem đang chọn (Dạng bảng, Thẻ, v.v.).",
                        icon: "Maximize"
                    }
                ],

                viewModesTitle: "Các Chế Độ Xem",
                viewModes: [
                    { name: "Dạng Bảng (Table)", desc: "Danh sách chi tiết lý tưởng để chỉnh sửa hàng loạt và sắp xếp công việc theo nhiều thuộc tính.", icon: "Table" },
                    { name: "Bảng Kanban", desc: "Quản lý quy trình trực quan với các thẻ kéo-thả được tổ chức theo cột trạng thái.", icon: "Kanban" },
                    { name: "Lịch (Calendar)", desc: "Chế độ xem tập trung vào lịch trình để xem hạn chót và công việc trên dòng thời gian tháng/tuần.", icon: "Calendar" },
                    { name: "Biểu Đồ Gantt", desc: "Xem dòng thời gian để lập kế hoạch dự án, hiển thị thời lượng công việc và các sự phụ thuộc.", icon: "GanttChart" },
                    { name: "Ma Trận Eisenhower", desc: "Ma trận ưu tiên phân chia công việc theo Mức độ Khẩn cấp và Quan trọng để ra quyết định tốt hơn.", icon: "LayoutGrid" },
                    { name: "Sơ Đồ PERT", desc: "Sơ đồ mạng để trực quan hóa sự phụ thuộc giữa các công việc và phân tích đường găng (critical path).", icon: "Network" }
                ],

                navigationTitle: "Mẹo & Phím Tắt",
                navigationTips: [
                    { text: "Click đúp vào **Icon Màu Trạng Thái** để lọc nhanh duy nhất trạng thái đó.", icon: "MousePointer2" },
                    { text: "Thu gọn sidebar để tối đa hóa không gian màn hình cho các view phức tạp như Gantt.", icon: "PanelLeftClose" },
                    { text: "Kéo và thả task trong Kanban và Calendar để cập nhật nhanh trạng thái hoặc ngày tháng.", icon: "Move" },
                    { text: "Tùy chỉnh hiển thị cột trong Table View thông qua menu 'Columns'.", icon: "Settings2" }
                ]
            },

            quotes: {
                title: "Báo Giá & Tiến Độ",
                subtitle: "Quản lý đề xuất, mốc thời gian và tài chính dự án",
                description: "Mô-đun toàn diện để xử lý các khía cạnh tài chính và kế hoạch của công việc. Tạo báo giá chuyên nghiệp, xác định các mốc quan trọng (Milestones) và theo dõi thanh toán tại cùng một nơi.",

                // Quotes Section
                creatingTitle: "Quy Trình Tạo Báo Giá",
                creatingSteps: [
                    {
                        title: "Khởi Tạo",
                        desc: "Mở một Task hoặc Dự án cụ thể và chuyển sang tab 'Price Quote'.",
                        icon: "FilePlus"
                    },
                    {
                        title: "Thêm Phần (Sections)",
                        desc: "Tổ chức các hạng mục thành nhóm logic (ví dụ: 'Thiết kế', 'Lập trình') bằng nút 'Add Section'.",
                        icon: "LayoutList"
                    },
                    {
                        title: "Chi Tiết Hạng Mục",
                        desc: "Thêm các đầu việc cụ thể với mô tả, số lượng và đơn giá. Hệ thống tự động tính tổng.",
                        icon: "ListPlus"
                    },
                    {
                        title: "Kiểm Tra & Lưu",
                        desc: "Xem lại tổng tiền, xác nhận cài đặt tiền tệ và lưu báo giá dưới dạng Nháp (Draft).",
                        icon: "Save"
                    }
                ],

                statusesTitle: "Vòng Đời (Status)",
                statuses: [
                    { name: "To Do", desc: "Giai đoạn đầu. Tạo task, soạn thảo báo giá. Sẵn sàng bắt đầu.", icon: "Circle", color: "bg-purple-100 text-purple-800" },
                    { name: "In Progress", desc: "Đang thực hiện. Dùng sub-status để theo dõi 'Đang code', 'Đã gửi báo giá'...", icon: "Timer", color: "bg-yellow-100 text-yellow-800" },
                    { name: "Done", desc: "Hoàn thành. Đánh dấu 'Đã giao' hoặc 'Đã thanh toán' khi kết thúc.", icon: "CheckCircle2", color: "bg-green-100 text-green-800" },
                    { name: "On Hold", desc: "Tạm dừng do khách phản hồi hoặc chờ tài nguyên.", icon: "PauseCircle", color: "bg-orange-100 text-orange-800" },
                    { name: "Archived", desc: "Lưu trữ. Ẩn khỏi view chính nhưng vẫn giữ trong lịch sử.", icon: "Archive", color: "bg-slate-100 text-slate-800" }
                ],

                // Timeline & Milestones
                timelineTitle: "Tiến Độ & Mốc Thời Gian",
                timelineDesc: "Chia nhỏ các nhiệm vụ phức tạp thành các mốc quan trọng để dễ dàng quản lý và liên kết thanh toán.",
                timelineSteps: [
                    {
                        title: "Tạo Milestone",
                        desc: "Trong tab 'Timeline', xác định các giai đoạn bàn giao chính (ví dụ: 'Bàn giao Giai đoạn 1').",
                        icon: "Flag"
                    },
                    {
                        title: "Đặt Deadline",
                        desc: "Gán ngày đến hạn cụ thể cho từng mốc để hệ thống tự động tạo biểu đồ Gantt.",
                        icon: "CalendarClock"
                    },
                    {
                        title: "Cập Nhật Tiến Độ",
                        desc: "Đánh dấu milestones là 'Hoàn thành' khi xong việc để cập nhật tiến độ chung của Task.",
                        icon: "CheckSquare"
                    }
                ],

                // Payments
                paymentsTitle: "Theo Dõi Thanh Toán",
                paymentsDesc: "Quản lý dòng tiền gắn liền với các mốc hoàn thành công việc.",
                paymentSteps: [
                    {
                        title: "Gắn Với Milestone",
                        desc: "Liên kết số tiền thanh toán với một mốc cụ thể (ví dụ: cọc 50% khi Bắt đầu dự án).",
                        icon: "Link2"
                    },
                    {
                        title: "Trạng Thái",
                        desc: "Theo dõi trạng thái: 'Pending' (Chờ), 'Overdue' (Quá hạn), hoặc 'Paid' (Đã thanh toán).",
                        icon: "CreditCard"
                    },
                    {
                        title: "Lịch Sử",
                        desc: "Lưu giữ hồ sơ ngày và số tiền giao dịch để báo cáo doanh thu.",
                        icon: "Receipt"
                    }
                ],

                templatesTitle: "Sử Dụng Mẫu (Templates)",
                templatesDesc: "Lưu cấu trúc báo giá thường dùng để tăng tốc độ làm việc. Lý tưởng cho các gói dịch vụ tiêu chuẩn.",
                templateSteps: [
                    "Tạo một báo giá với các phần và hạng mục chuẩn.",
                    "Nhấn nút 'Save as Template' trên thanh công cụ.",
                    "Đặt tên cho mẫu (ví dụ: 'Gói Thiết Kế Web Cơ Bản').",
                    "Áp dụng cho báo giá mới thông qua menu 'Load Template'."
                ],

                sharingTitle: "Chia Sẻ & Xuất File",
                sharingOptions: [
                    { text: "Tạo Link Công Khai", desc: "Tạo đường dẫn an toàn, chỉ xem (read-only) để gửi khách hàng.", icon: "Link" },
                    { text: "Xuất PDF", desc: "Tải xuống tài liệu PDF chuyên nghiệp để đính kèm email.", icon: "FileDown" },
                    { text: "Copy Clipboard", desc: "Sao chép nhanh tóm tắt báo giá để dán vào chat hoặc email.", icon: "Copy" }
                ]
            },

            backup: {
                title: "Sao Lưu & Khôi Phục",
                subtitle: "Bảo vệ dữ liệu với các bản sao lưu định kỳ",
                description: "Freelance Flow cung cấp các tính năng sao lưu và khôi phục toàn diện để đảm bảo dữ liệu của bạn luôn an toàn. Truy cập tính năng này trong Cài đặt > Tab Dữ liệu.",

                exportTitle: "Xuất Dữ Liệu",
                exportDesc: "Tạo bản sao lưu đầy đủ của tất cả dữ liệu để lưu trữ an toàn:",
                exportFormats: [
                    {
                        name: "Định dạng Excel (.xlsx)",
                        desc: "Bảng tính dễ đọc với các sheet riêng cho Tasks, Clients, Quotes, v.v. Dễ xem và chỉnh sửa trong Excel hoặc Google Sheets.",
                        recommended: true
                    },
                    {
                        name: "Định dạng JSON (.json)",
                        desc: "Định dạng dữ liệu thô, lý tưởng cho người dùng kỹ thuật hoặc quy trình tự động. Bảo toàn tất cả dữ liệu chính xác như được lưu trữ."
                    }
                ],

                importTitle: "Nhập Dữ Liệu",
                importDesc: "Khôi phục dữ liệu từ file backup đã xuất trước đó:",
                importModes: [
                    {
                        name: "Chế Độ Gộp",
                        desc: "Kết hợp dữ liệu nhập với dữ liệu hiện có. Hữu ích khi chuyển dữ liệu giữa các thiết bị mà không mất công việc hiện tại.",
                        icon: "Merge"
                    },
                    {
                        name: "Chế Độ Ghi Đè",
                        desc: "Thay thế toàn bộ dữ liệu hiện có bằng dữ liệu nhập. Dùng khi khôi phục từ bản sao lưu đầy đủ hoặc bắt đầu mới.",
                        icon: "Replace"
                    }
                ],

                autoBackupTitle: "Sao Lưu Tự Động",
                autoBackupDesc: "Hệ thống tự động bảo vệ dữ liệu của bạn:",
                autoBackupFeatures: [
                    {
                        name: "Tự Động Sao Lưu 24 Giờ",
                        desc: "Dữ liệu được tự động sao lưu mỗi 24 giờ vào bộ nhớ cục bộ của trình duyệt."
                    },
                    {
                        name: "Lịch Sử Sao Lưu",
                        desc: "Tối đa 5 bản sao lưu gần đây được giữ lại, cho phép bạn khôi phục từ bất kỳ phiên bản trước đó."
                    },
                    {
                        name: "Phục Hồi Dữ Liệu",
                        desc: "Nếu dữ liệu chính bị mất (ví dụ: sau khi xóa dữ liệu trình duyệt), hệ thống cố gắng tự động phục hồi từ bản sao lưu."
                    }
                ],

                dangerZoneTitle: "Vùng Nguy Hiểm",
                dangerZoneDesc: "Xóa tất cả dữ liệu vĩnh viễn. Hành động này không thể hoàn tác!",
                clearOptions: [
                    {
                        name: "Chỉ Xóa Dữ Liệu Chính",
                        desc: "Xóa tasks, clients, quotes, v.v. nhưng giữ lịch sử backup để có thể phục hồi."
                    },
                    {
                        name: "Xóa Dữ Liệu và Backup",
                        desc: "Xóa mọi thứ bao gồm cả lịch sử backup. Bắt đầu mới hoàn toàn không có tùy chọn phục hồi."
                    }
                ],

                tipsTitle: "Thực Hành Tốt Nhất",
                tips: [
                    "Xuất bản sao lưu trước khi thay đổi lớn hoặc đổi thiết bị",
                    "Dùng định dạng Excel để dễ xem và chia sẻ với người khác",
                    "Lưu backup trên lưu trữ đám mây (Google Drive, Dropbox) để an toàn hơn",
                    "Thử khôi phục trên trình duyệt mới để kiểm tra tính toàn vẹn của backup"
                ]
            },
            shared: {
                title: "Chia Sẻ Khách Hàng",
                subtitle: "Chia sẻ báo giá và timeline chuyên nghiệp",
                description: "Chia sẻ báo giá và timeline dự án với khách hàng ở nhiều định dạng. Truy cập tính năng Share từ dialog chi tiết của task.",

                methodsTitle: "Định Dạng Chia Sẻ",
                methods: [
                    {
                        title: "Share Link",
                        desc: "Tạo link bảo mật để chia sẻ báo giá và timeline với khách. Xem trực tiếp, tương tác.",
                        icon: "Link"
                    },
                    {
                        title: "Share PDF",
                        desc: "Tải báo giá và timeline dưới dạng PDF để gửi qua email hoặc tin nhắn.",
                        icon: "FileDown"
                    },
                    {
                        title: "Share Image",
                        desc: "Copy báo giá hoặc timeline dưới dạng hình ảnh vào clipboard để chia sẻ nhanh.",
                        icon: "Image"
                    }
                ],

                stepsTitle: "Cách Chia Sẻ",
                steps: [
                    {
                        title: "Mở Dialog Task",
                        desc: "Click vào bất kỳ task nào để mở dialog chi tiết.",
                        icon: "MousePointerClick"
                    },
                    {
                        title: "Nhấn Nút Share",
                        desc: "Tìm và nhấn nút 'Share' trong dialog chi tiết task.",
                        icon: "Share2"
                    },
                    {
                        title: "Cấu Hình Hiển Thị",
                        desc: "Chọn thông tin hiển thị: lựa chọn các phần được bao gồm trong view chia sẻ.",
                        icon: "Settings"
                    },
                    {
                        title: "Chọn Định Dạng",
                        desc: "Chọn định dạng ưa thích: Link (live), PDF (tải về), hoặc Image (copy).",
                        icon: "ArrowRight"
                    }
                ],

                clientViewTitle: "Tính Năng Nội Dung Chia Sẻ",
                clientFeatures: [
                    { text: "Trình bày báo giá chuyên nghiệp", icon: "Briefcase" },
                    { text: "Bao gồm timeline trực quan", icon: "Calendar" },
                    { text: "Khách không cần đăng nhập", icon: "Unlock" },
                    { text: "Hiển thị tốt trên mobile", icon: "Smartphone" }
                ]
            },

            analysis: {
                title: "Phân Tích Dự Án",
                subtitle: "Hiểu rõ hiệu suất kinh doanh của bạn",
                description: "Tính năng Phân tích cung cấp cái nhìn sâu sắc về hiệu suất dự án, tình hình tài chính và năng suất làm việc, giúp bạn đưa ra quyết định dựa trên dữ liệu.",

                typesTitle: "Các Loại Phân Tích",
                analysisTypes: [
                    {
                        title: "Phân Tích Tài Chính",
                        subtitle: "Doanh Thu & Chi Phí",
                        desc: "Theo dõi sức khỏe tài chính với các báo cáo chi tiết về doanh thu, chi phí và biên lợi nhuận theo thời gian.",
                        metrics: [
                            { label: "Xu Hướng Doanh Thu", desc: "Biểu đồ đường hiển thị tăng trưởng.", icon: "TrendingUp" },
                            { label: "Cấu Trúc Chi Phí", desc: "Biểu đồ tròn phân tích các loại chi phí.", icon: "PieChart" },
                            { label: "Biên Lợi Nhuận", desc: "Tính toán lợi nhuận ròng trên từng dự án.", icon: "Percent" },
                            { label: "Run Rate", desc: "Dự báo doanh thu năm dựa trên dữ liệu hiện tại.", icon: "Target" }
                        ],
                        icon: "Banknote"
                    },
                    {
                        title: "Chỉ Số Dự Án",
                        subtitle: "Tiến Độ & Trạng Thái",
                        desc: "Giám sát sức khỏe dự án thông qua tỷ lệ hoàn thành, phân bố trạng thái và tốc độ thực hiện.",
                        metrics: [
                            { label: "Tỷ Lệ Hoàn Thành", desc: "% công việc đã xong so với tổng số.", icon: "Activity" },
                            { label: "Phân Bố Trạng Thái", desc: "Biểu đồ cột nhiệm vụ theo trạng thái.", icon: "BarChart3" },
                            { label: "Theo Dõi Thời Gian", desc: "So sánh thời gian Ước tính vs Thực tế.", icon: "Clock" },
                            { label: "Burndown", desc: "Khối lượng công việc còn lại theo thời gian.", icon: "ArrowDownCircle" }
                        ],
                        icon: "Kanban"
                    },
                    {
                        title: "Năng Suất",
                        subtitle: "Hiệu Quả & Tập Trung",
                        desc: "Đo lường năng suất cá nhân và nhóm thông qua dữ liệu chấm công và thống kê Pomodoro.",
                        metrics: [
                            { label: "Task Hoàn Thành", desc: "Sản lượng theo Ngày/Tuần/Tháng.", icon: "CheckSquare" },
                            { label: "Thời Gian Tập Trung", desc: "Tổng giờ làm việc sâu (Deep Work).", icon: "BrainCircuit" },
                            { label: "Thống Kê Pomodoro", desc: "Số phiên làm việc đã hoàn thành.", icon: "Timer" },
                            { label: "Độ Ưu Tiên", desc: "Phân bổ các đầu việc quan trọng.", icon: "Layers" }
                        ],
                        icon: "Zap"
                    }
                ],

                aiTitle: "Phân Tích Hỗ Trợ AI",
                aiDesc: "Sử dụng trí tuệ nhân tạo để phát hiện các mẫu ẩn và nhận các đề xuất hành động.",
                aiSteps: [
                    { text: "Chọn khoảng thời gian (VD: 30 ngày qua).", icon: "CalendarRange" },
                    { text: "Nhấn nút 'Analyze with AI'.", icon: "Sparkles" },
                    { text: "Xem insights về xu hướng và rủi ro.", icon: "Lightbulb" },
                    { text: "Áp dụng đề xuất để cải thiện quy trình.", icon: "Rocket" }
                ],
                aiFeatures: [
                    { name: "Phát Hiện Xu Hướng", desc: "Nhận diện thói quen làm việc lặp lại.", icon: "LineChart" },
                    { name: "Cảnh Báo Rủi Ro", desc: "Báo động nguy cơ chậm tiến độ hoặc lạm chi.", icon: "AlertTriangle" },
                    { name: "Dự Báo Thông Minh", desc: "Ước tính ngày hoàn thành dựa trên tốc độ lịch sử.", icon: "Radar" }
                ]
            },

            widgets: {
                title: "Dashboard Widgets",
                subtitle: "Tùy chỉnh không gian làm việc cá nhân",
                description: "Widgets cung cấp cái nhìn tương tác, nhỏ gọn về dữ liệu quan trọng nhất của bạn. Ghim chúng vào bảng điều khiển để nắm bắt thông tin quan trọng ngay lập tức.",

                featuresTitle: "Các Widget Có Sẵn",
                features: [
                    {
                        title: "Pomodoro Timer",
                        desc: "Đồng hồ tập trung trên header với chu kỳ 25p làm việc / 5p nghỉ.",
                        features: ["Tích hợp Header", "Chế độ Tập trung/Nghỉ", "Bắt đầu 1 chạm"],
                        icon: "Timer"
                    },
                    {
                        title: "Sticky Notes",
                        desc: "Sổ tay ghi chú nhanh ở sidebar cho các nội dung tạm thời.",
                        features: ["Luôn truy cập được", "Tự động lưu", "Chỉ văn bản"],
                        icon: "StickyNote"
                    },
                    {
                        title: "Quick Calculator",
                        desc: "Máy tính tích hợp sẵn trong form tạo/sửa Task.",
                        features: ["Phép tính cơ bản", "Truy cập trong form", "Tính nhanh"],
                        icon: "Calculator"
                    },
                    {
                        title: "Work Timer",
                        desc: "Hệ thống Check-in / Check-out trên header để theo dõi tổng giờ làm mỗi ngày.",
                        features: ["Theo dõi phiên", "Tổng kết ngày", "Chỉ báo trạng thái"],
                        icon: "Clock"
                    },
                    {
                        title: "AI Quote Suggestion",
                        desc: "Gợi ý giá thông minh dựa trên mô tả công việc.",
                        features: ["Hiểu ngữ cảnh", "Dữ liệu lịch sử", "Áp dụng 1 click"],
                        icon: "Sparkles"
                    }
                ],

                managementTitle: "Vị Trí Widget",
                managementSteps: [
                    {
                        title: "Khu Vực Header",
                        desc: "Tìm Pomodoro Timer và Work Timer (Check-in) ở góc trên bên phải ứng dụng.",
                        icon: "Layout"
                    },
                    {
                        title: "Sidebar (Thanh Bên)",
                        desc: "Widget Sticky Notes được ghim ở sidebar phải để dễ dàng truy cập từ mọi trang.",
                        icon: "Sidebar"
                    },
                    {
                        title: "Form Task",
                        desc: "Tìm biểu tượng Máy tính và Gợi ý AI bên trong các hộp thoại chỉnh sửa task.",
                        icon: "Edit3"
                    }
                ],

                tipsTitle: "Mẹo Sử Dụng",
                tips: [
                    { text: "Dùng Pomodoro cho các phiên làm việc sâu để tránh kiệt sức.", icon: "Timer" },
                    { text: "Check-in vào đầu ngày làm việc để theo dõi chấm công chính xác.", icon: "CheckCircle" },
                    { text: "Dùng Sticky Notes để lưu tạm các ID hoặc số điện thoại.", icon: "StickyNote" }
                ]
            },
        },

        // Nghiệp vụ
        business: {
            financials: {
                title: "Tính Toán Tài Chính",
                subtitle: "Hiểu rõ các chỉ số kinh doanh của bạn",
                description: "Freelance Flow tự động tính toán các chỉ số tài chính chính để giúp bạn hiểu rõ hiệu suất kinh doanh của mình.",

                metricsTitle: "Các Chỉ Số Tài Chính Chính",
                metrics: [
                    {
                        name: "Doanh thu",
                        formula: "Tổng grand total của các quote đã thanh toán",
                        desc: "Tổng thu nhập từ công việc có quote trạng thái 'Đã thanh toán'. Click để xem chi tiết theo task/khách."
                    },
                    {
                        name: "Chi phí",
                        formula: "Chi phí cộng tác viên + Chi phí cố định (đã thanh toán)",
                        desc: "Tổng chi phí bao gồm thanh toán cho cộng tác viên và chi tiêu có trạng thái 'Đã thanh toán'."
                    },
                    {
                        name: "Lợi nhuận",
                        formula: "Doanh thu - Chi phí",
                        desc: "Lợi nhuận ròng sau khi trừ tất cả chi phí đã thanh toán từ doanh thu đã nhận."
                    },
                    {
                        name: "Doanh thu Tương lai",
                        formula: "Tổng giá trị quote chưa thanh toán",
                        desc: "Thu nhập dự kiến từ các quote chưa được thanh toán. Thanh toán đợi lịch chờ hoàn thành."
                    },
                    {
                        name: "Doanh thu Thất thoát",
                        formula: "Tổng giá trị quote của task On-hold",
                        desc: "Thu nhập tiềm năng từ các task được đánh dấu 'Tạm hoãn'. Doanh thu có thể được phục hồi hoặc mất."
                    },
                    {
                        name: "Chi phí Cố định",
                        formula: "Chi phí định kỳ × thời gian",
                        desc: "Chi phí hoạt động (thuê bao, thuê nhà, v.v.) được tính toán cho khoảng thời gian đã chọn."
                    }
                ],

                chartsTitle: "Biểu Đồ Tài Chính",
                chartsDesc: "Phần Phân Tích Tài Chính cung cấp phân tích trực quan thông qua các biểu đồ tương tác:",
                charts: [
                    {
                        name: "Hàng Tháng",
                        desc: "Biểu đồ cột hiển thị xu hướng doanh thu theo thời gian, giúp bạn xác định các giai đoạn có thu nhập cao."
                    },
                    {
                        name: "Xu Hướng Lợi Nhuận",
                        desc: "Biểu đồ đường theo dõi biên lợi nhuận của bạn từng tháng để phân tích hiệu suất."
                    },
                    {
                        name: "Top Khách Hàng",
                        desc: "Biểu đồ xếp hạng các khách hàng trả nhiều nhất dựa trên tổng giá trị báo giá."
                    }
                ],

                aiAnalysisTitle: "Phân Tích Kinh Doanh AI",
                aiAnalysisDesc: "Tận dụng AI để có được thông tin chi tiết thông minh về hiệu suất kinh doanh của bạn:",
                aiFeatures: [
                    {
                        name: "Phân Tích Một Chạm",
                        desc: "Nhấn nút 'Phân tích bằng AI' để tạo ra các nhận định kinh doanh toàn diện ngay lập tức."
                    },
                    {
                        name: "Phát Hiện Xu Hướng",
                        desc: "AI xác định các mô hình trong doanh thu, chi phí và lợi nhuận trong khoảng thời gian đã chọn."
                    },
                    {
                        name: "Đề Xuất Thông Minh",
                        desc: "Nhận các gợi ý hành động để cải thiện lợi nhuận và tối ưu hóa quy trình làm việc."
                    },
                    {
                        name: "Cảnh Báo Rủi Ro",
                        desc: "AI cảnh báo về các vấn đề tiềm ẩn như biên lợi nhuận giảm hoặc thanh toán quá hạn."
                    }
                ],

                tipsTitle: "Mẹo Quản Lý Tài Chính",
                tips: [
                    "Thường xuyên cập nhật báo giá và chi phí của bạn",
                    "Theo dõi chi phí cố định riêng biệt với chi phí dự án",
                    "Sử dụng phân tích AI để xác định xu hướng và cơ hội",
                    "Xem xét biểu đồ hàng tháng để theo dõi hiệu suất"
                ]
            },

            productivityAnalysis: {
                title: "Phân Tích Năng Suất",
                subtitle: "Theo dõi mô hình làm việc và tối ưu hóa hiệu suất",
                description: "Bảng điều khiển Phân Tích Năng Suất trong phần Analysis giúp bạn hiểu mô hình làm việc, theo dõi deadline và cải thiện hiệu quả thông qua thông tin chi tiết dựa trên dữ liệu.",

                workTimeTitle: "Thống Kê Thời Gian Làm Việc",
                workTimeDesc: "Theo dõi giờ làm việc và thời gian tập trung để hiểu mô hình năng suất:",
                workTimeMetrics: [
                    {
                        name: "Tổng Giờ Làm Việc",
                        desc: "Tổng tất cả giờ làm việc đã ghi trong khoảng thời gian đã chọn, bao gồm nhập thủ công và phiên hẹn giờ."
                    },
                    {
                        name: "Tổng Giờ Tập Trung",
                        desc: "Giờ dành cho các phiên làm việc tập trung (Pomodoro timer). Chỉ số chính về chất lượng làm việc sâu."
                    },
                    {
                        name: "Pomodoro Hoàn Thành",
                        desc: "Số phiên Pomodoro đã hoàn thành. Mỗi phiên đại diện cho 25 phút tập trung không bị gián đoạn."
                    },
                    {
                        name: "Biểu Đồ Theo Ngày",
                        desc: "Biểu đồ cột xếp chồng hiển thị giờ làm việc so với giờ tập trung cho mỗi ngày trong khoảng thời gian."
                    }
                ],

                taskAnalyticsTitle: "Phân Tích Task",
                taskAnalyticsDesc: "Phân tích phân bố task và xu hướng để tối ưu hóa quy trình làm việc:",
                taskAnalyticsFeatures: [
                    {
                        name: "Biểu Đồ Phân Bố",
                        desc: "Biểu đồ tròn hiển thị phân chia task theo trạng thái, khách hàng hoặc danh mục. Giúp xác định nơi tập trung công sức."
                    },
                    {
                        name: "Phân Tích Xu Hướng",
                        desc: "Biểu đồ đường hiển thị xu hướng tạo task theo thời gian. Xác định các giai đoạn cao điểm và mô hình khối lượng công việc."
                    },
                    {
                        name: "Tùy Chọn Nhóm",
                        desc: "Chuyển đổi giữa các chế độ xem Trạng thái, Khách hàng, Danh mục hoặc Eisenhower để có góc nhìn khác nhau."
                    },
                    {
                        name: "Thống Kê Tóm Tắt",
                        desc: "Tổng quan nhanh hiển thị số lượng task đang hoạt động, sắp đến hạn và quá hạn."
                    }
                ],

                deadlineAlertsTitle: "Cảnh Báo Deadline",
                deadlineAlertsDesc: "Theo dõi các deadline sắp tới với đánh giá rủi ro thông minh:",
                deadlineFeatures: [
                    {
                        name: "Đánh Giá Rủi Ro",
                        desc: "Task được mã hóa màu theo rủi ro deadline: Nguy cấp (đỏ), Cao (cam), Trung bình (vàng), Thấp (xanh)."
                    },
                    {
                        name: "Hành Động Nhanh",
                        desc: "Thay đổi trạng thái task hoặc gia hạn deadline trực tiếp từ thẻ cảnh báo mà không cần mở task."
                    },
                    {
                        name: "Deadline Sắp Tới",
                        desc: "Danh sách các task có deadline đang đến được sắp xếp theo mức độ khẩn cấp, hiển thị số ngày còn lại."
                    }
                ],

                aiInsightsTitle: "Nhận Định AI",
                aiInsightsDesc: "Nhận các đề xuất thông minh dựa trên dữ liệu của bạn:",
                aiInsightsFeatures: [
                    {
                        name: "Phát Hiện Mô Hình",
                        desc: "AI phân tích các mô hình làm việc, tỷ lệ tập trung và tỷ lệ hoàn thành task để xác định xu hướng."
                    },
                    {
                        name: "Đề Xuất Hành Động",
                        desc: "Nhận các gợi ý cụ thể để cải thiện năng suất, giảm rủi ro và tối ưu hóa quy trình làm việc."
                    },
                    {
                        name: "Mức Độ Nghiêm Trọng",
                        desc: "Các nhận định được phân loại là Nguy cấp, Cao, Trung bình hoặc Thấp dựa trên tác động kinh doanh."
                    }
                ]
            }
        },

        // Lý thuyết
        theories: {
            kanban: {
                title: "Phương pháp Kanban",
                subtitle: "Quản lý quy trình làm việc trực quan",
                description: "Kanban là phương pháp quản lý dự án trực quan giúp bạn hình dung công việc, giới hạn công việc đang thực hiện và tối đa hóa hiệu quả. Lọc các cột bằng cách click vào các nút filter màu tương ứng với trạng thái.",

                principlesTitle: "Nguyên tắc Cốt lõi",
                principles: [
                    {
                        title: "Trực quan hóa Công việc",
                        desc: "Làm cho tất cả công việc hiển thị trên bảng với các cột đại diện cho các giai đoạn khác nhau."
                    },
                    {
                        title: "Giới hạn WIP",
                        desc: "Giới hạn công việc đang thực hiện để tránh quá tải và cải thiện sự tập trung."
                    },
                    {
                        title: "Quản lý Luồng",
                        desc: "Giám sát và tối ưu hóa luồng công việc qua hệ thống."
                    },
                    {
                        title: "Làm rõ Chính sách",
                        desc: "Định nghĩa rõ ràng cách công việc di chuyển giữa các giai đoạn."
                    }
                ],

                usageTitle: "Sử dụng Kanban trong Freelance Flow",
                usageSteps: [
                    "Chuyển sang chế độ xem Kanban từ sidebar",
                    "Lọc cột bằng cách click vào các nút filter màu tương ứng với trạng thái",
                    "Kéo và thả công việc giữa các cột trạng thái",
                    "Tùy chỉnh cột trong Settings > Statuses",
                    "Thêm sub-status cho theo dõi chi tiết hơn"
                ],

                tipsTitle: "Thực hành Tốt nhất",
                tips: [
                    "Giữ bảng của bạn được tổ chức và cập nhật",
                    "Đặt giới hạn WIP cho mỗi cột",
                    "Xem xét và cập nhật thường xuyên",
                    "Sử dụng màu sắc và nhãn để nhận diện nhanh"
                ]
            },

            gantt: {
                title: "Biểu đồ Gantt",
                subtitle: "Lập kế hoạch dự án dựa trên thời gian",
                description: "Biểu đồ Gantt cung cấp dòng thời gian trực quan của dự án, hiển thị thời lượng công việc, phụ thuộc và tiến độ. Cũng được sử dụng khi tạo timeline cho các task.",

                componentsTitle: "Các Thành phần Biểu đồ Gantt",
                components: [
                    { name: "Task Bars", desc: "Thanh ngang đại diện cho thời lượng công việc" },
                    { name: "Timeline", desc: "Thang thời gian hiển thị tiến độ dự án" },
                    { name: "Dependencies", desc: "Đường kết nối các công việc liên quan" },
                    { name: "Milestones", desc: "Các mốc quan trọng của dự án" }
                ],

                usageTitle: "Sử dụng Chế độ Gantt",
                usageSteps: [
                    "Chuyển sang chế độ xem Gantt từ sidebar",
                    "Đặt ngày bắt đầu và kết thúc cho công việc",
                    "Kéo thanh công việc để điều chỉnh lịch trình",
                    "Xem tiến độ và thời gian dự án"
                ],

                benefitsTitle: "Lợi ích",
                benefits: [
                    "Trực quan hóa rõ ràng tiến độ dự án",
                    "Dễ dàng xác định xung đột lịch trình",
                    "Phân bổ nguồn lực tốt hơn",
                    "Theo dõi tiến độ dự án nhanh chóng"
                ]
            },

            eisenhower: {
                title: "Ma trận Eisenhower",
                subtitle: "Quản lý công việc dựa trên ưu tiên",
                description: "Ma trận Eisenhower giúp bạn ưu tiên công việc bằng cách phân loại chúng dựa trên mức độ khẩn cấp và quan trọng.",
                note: "Ở các view khác trong app, mức độ khẩn cấp quan trọng được biểu thị bằng icon Flag với các màu tương ứng. Có thể thay đổi các set màu trong cài đặt.",

                quadrantsTitle: "Bốn Góc phần tư",
                quadrants: [
                    {
                        name: "LÀM (Khẩn cấp & Quan trọng)",
                        desc: "Công việc quan trọng cần chú ý ngay lập tức. Làm những việc này trước.",
                        color: "Đỏ"
                    },
                    {
                        name: "QUYẾT ĐỊNH (Không khẩn cấp & Quan trọng)",
                        desc: "Công việc quan trọng có thể lên lịch. Lập kế hoạch thời gian cho những việc này.",
                        color: "Xanh dương"
                    },
                    {
                        name: "ỦY QUYỀN (Khẩn cấp & Không quan trọng)",
                        desc: "Công việc cần làm sớm nhưng có thể ủy quyền cho người khác.",
                        color: "Vàng"
                    },
                    {
                        name: "XÓA (Không khẩn cấp & Không quan trọng)",
                        desc: "Công việc giá trị thấp nên loại bỏ hoặc giảm thiểu.",
                        color: "Xám"
                    }
                ],

                usageTitle: "Sử dụng Ma trận",
                usageSteps: [
                    "Chuyển sang chế độ xem Eisenhower từ sidebar",
                    "Kéo công việc vào góc phần tư phù hợp",
                    "Đặt số lượng công việc tối đa mỗi góc trong Settings",
                    "Xem xét và điều chỉnh ưu tiên thường xuyên"
                ],

                tipsTitle: "Mẹo Ưu tiên",
                tips: [
                    "Trung thực về những gì thực sự khẩn cấp và quan trọng",
                    "Đừng để việc khẩn cấp lấn át việc quan trọng",
                    "Thường xuyên xem xét và dọn dẹp góc XÓA",
                    "Tập trung hoàn thành công việc LÀM trước khi chuyển sang các việc khác"
                ]
            },

            pert: {
                title: "Phân tích PERT",
                subtitle: "Kỹ thuật đánh giá và xem xét dự án",
                description: "PERT là phương pháp quản lý dự án được sử dụng để phân tích và biểu diễn các nhiệm vụ thông qua sơ đồ mạng.",

                componentsTitle: "Thành Phần Chính",
                components: [
                    { name: "Nodes (Nút)", desc: "Đại diện cho các sự kiện hoặc mốc quan trọng", icon: "Circle" },
                    { name: "Edges (Cạnh)", desc: "Đại diện cho các nhiệm vụ hoặc hoạt động giữa các sự kiện", icon: "GitBranch" },
                    { name: "Critical Path (Đường găng)", desc: "Chuỗi dài nhất xác định thời gian hoàn thành tối thiểu", icon: "TrendingUp" }
                ],

                usageTitle: "Sử dụng PERT trong Freelance Flow",
                usageSteps: [
                    "Chuyển sang chế độ xem PERT từ sidebar",
                    "Xem các nhiệm vụ được sắp xếp theo phụ thuộc",
                    "Xác định đường găng (critical path) của dự án",
                    "Tối ưu hóa lịch trình dựa trên phân tích"
                ],

                benefitsTitle: "Lợi Ích",
                benefits: [
                    "Trực quan hóa rõ ràng các phụ thuộc giữa nhiệm vụ",
                    "Xác định nhiệm vụ quan trọng ảnh hưởng đến tiến độ",
                    "Ước tính thời gian hoàn thành chính xác hơn",
                    "Phát hiện điểm nghẽn tiềm ẩn trong dự án"
                ],

                tipsTitle: "Thực Hành Tốt Nhất",
                tips: [
                    "Xác định rõ phụ thuộc giữa các nhiệm vụ",
                    "Tập trung vào tối ưu các nhiệm vụ trên đường găng",
                    "Cập nhật sơ đồ khi có thay đổi trong dự án",
                    "Sử dụng kết hợp với Gantt để quản lý toàn diện"
                ]
            },

            pomodoro: {
                title: "Kỹ thuật Pomodoro",
                subtitle: "Phương pháp quản lý thời gian hiệu quả",
                description: "Kỹ thuật Pomodoro sử dụng bộ hẹn giờ để chia công việc thành các khoảng thời gian tập trung (thường là 25 phút), được phân tách bởi thời gian nghỉ ngắn để tối đa hóa năng suất.",

                cycleTitle: "Chu Kỳ Pomodoro Tiêu Chuẩn",
                cycle: [
                    { duration: "25 phút", desc: "Làm việc tập trung (1 Pomodoro)", icon: "Timer" },
                    { duration: "5 phút", desc: "Nghỉ ngắn", icon: "Coffee" },
                    { duration: "15-30 phút", desc: "Nghỉ dài (sau 4 Pomodoros)", icon: "Armchair" }
                ],

                usageTitle: "Sử dụng Pomodoro trong Freelance Flow",
                usageSteps: [
                    "Đặt thời gian ước tính cho nhiệm vụ (số Pomodoros)",
                    "Bắt đầu bộ đếm thời gian và làm việc tập trung",
                    "Nghỉ ngơi khi hết thời gian",
                    "Theo dõi số Pomodoros đã hoàn thành"
                ],

                benefitsTitle: "Lợi Ích",
                benefits: [
                    { title: "Tăng Tập Trung", desc: "Các khoảng thời gian ngắn dễ duy trì sự tập trung", icon: "Focus" },
                    { title: "Giảm Mệt Mỏi", desc: "Nghỉ ngơi thường xuyên ngăn ngừa kiệt sức", icon: "Battery" },
                    { title: "Cải Thiện Ước Tính", desc: "Học cách ước tính thời gian chính xác hơn", icon: "Target" },
                    { title: "Tăng Năng Suất", desc: "Cảm giác khẩn cấp nhẹ thúc đẩy hiệu quả", icon: "Zap" }
                ],

                tipsTitle: "Thực Hành Tốt Nhất",
                tips: [
                    "Loại bỏ mọi phiền nhiễu trong Pomodoro",
                    "Không chia nhỏ Pomodoro - hoàn thành hoặc bắt đầu lại",
                    "Ghi chép tiến độ sau mỗi Pomodoro",
                    "Điều chỉnh thời gian cho phù hợp với bạn (25 phút là tiêu chuẩn)",
                    "Sử dụng thời gian nghỉ để thực sự thư giãn"
                ],

                applicationTitle: "Ứng Dụng vào Công Việc Freelance",
                applications: [
                    "Dùng cho công việc cần tập trung cao (coding, design)",
                    "Theo dõi thời gian làm việc thực tế cho dự án",
                    "Cải thiện khả năng báo giá dựa trên dữ liệu thực tế",
                    "Cân bằng giữa làm việc và nghỉ ngơi"
                ]
            }
        }
    },
};
