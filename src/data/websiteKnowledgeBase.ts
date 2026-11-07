/**
 * GRANTLY Comprehensive Website Knowledge Base
 * Used by Gemini AI to answer any question about GRANTLY features, workflows, and modules.
 */

export const GRANTLY_KNOWLEDGE_BASE = {
  about: {
    name: 'GRANTLY',
    tagline: 'Every opportunity deserves a fair chance.',
    category: 'EdTech / FinTech / AI-powered Scholarship Discovery & Management Platform',
    mission: 'GRANTLY simplifies the educational financial assistance journey by replacing scattered portals, confusing eligibility criteria, missed deadlines, and lost documents with a unified, deterministic, intelligent student command center.',
    coreValues: [
      'Clarity: Students understand their opportunities through transparent guidelines.',
      'Confidence: Students know exactly why they qualify through explainable rules.',
      'Control: Students manage their complete scholarship journey in one centralized digital workspace.',
    ],
  },
  sixCoreModules: [
    {
      id: 1,
      name: 'Smart Student Profile',
      route: '/dashboard/profile (Setup via /onboarding)',
      description: 'The foundation of the platform. Eliminates repeated questionnaires by capturing student data once.',
      steps: [
        'Step 1: Personal Identification & Domicile (Full name, DOB, Domicile State, District, Gender, Social Category).',
        'Step 2: Educational Information (Institution name, type, course stream, degree, academic year).',
        'Step 3: Academic Performance (Latest percentage/CGPA, previous board score, semester achievements).',
        'Step 4: Financial Background (Annual household income, income range, financial hardship circumstances).',
        'Step 5: Scheme Preferences (Government, Private/CSR, Merit-based, Need-based, Research grants).',
      ],
      features: [
        'Real-time Completeness Percentage Meter (0–100%).',
        'Missing Information Alert flags that pinpoint exactly which fields are blocking eligibility.',
        'Persistent storage across sessions.',
      ],
    },
    {
      id: 2,
      name: 'Scholarship Discovery Engine',
      route: '/scholarships (Public) & /dashboard/discover (Personalized)',
      description: 'Faceted search and discovery across verified official government portals, corporate CSR trusts, and institutional programs.',
      sections: [
        'Best Matches: Scholarships for which 100% of currently known mandatory eligibility criteria are satisfied.',
        'Explore More: Opportunities that may be relevant but require additional information or verification.',
        'Closing Soon: Matching opportunities approaching their application deadlines (within 20 days).',
      ],
      filters: 'Search by keyword, Provider, Category (Government, Corporate CSR, Private, Research), Education Level, State Domicile, and Eligibility Status.',
    },
    {
      id: 3,
      name: 'Eligibility Intelligence Engine & What-If Simulator',
      route: '/dashboard/eligibility/:id',
      description: 'Deterministic mathematical rule evaluation matrix that eliminates black-box rejections.',
      keyDifferentiators: [
        'Rule Evaluation Matrix: Compares student score, income, state, and course against official criteria with Matched, Failed, or Missing statuses.',
        'What-If Simulator: Allows students to test hypothetical scores, income changes, or states in-memory without altering their real profile.',
        'Opportunity Recovery Engine: If a student fails a grant, recommends 3 alternative scholarships where they ARE 100% eligible.',
        'AI Explanatory Layer: Translates complex legal guidelines into encouraging, plain English or simple Hindi.',
      ],
    },
    {
      id: 4,
      name: 'Application Command Center',
      route: '/dashboard/applications',
      description: 'End-to-end management pipeline for all active student scholarship applications.',
      views: 'Interactive Kanban Board and sortable Table View.',
      stages: ['Saved', 'Preparing', 'Ready to Apply', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Withdrawn'],
      features: [
        'Next Best Action Engine: Suggests the single most impactful task for each application (e.g., upload missing income certificate, submit before deadline).',
        'Official Reference Number Recording: Store registration numbers for easy tracking with providers.',
        'Workspace Activity History: Timestamped audit trail of all status updates and document linkages.',
        'Confetti Celebration: Fires confetti animation when an application is marked as Submitted.',
      ],
    },
    {
      id: 5,
      name: 'Smart Document Vault & Reuse Intelligence',
      route: '/dashboard/documents',
      description: 'Encrypted document management with cross-scholarship Document Reuse Intelligence.',
      supportedTypes: ['Identity Proof', 'Income Certificate', 'Academic Marksheets', 'Bonafide Certificate', 'Caste Certificate', 'Bank Proof', 'Photograph', 'Fee Receipt'],
      features: [
        'Document Reuse Multiplier: Shows how a single uploaded marksheet or income certificate satisfies multiple scholarship requirements simultaneously.',
        'Document Readiness Percentage: Compares vault documents with scholarship requirements to show readiness (0–100%).',
        'Drag & Drop upload with file metadata tracking (file size, format, upload date).',
      ],
    },
    {
      id: 6,
      name: 'Deadline Intelligence & Personalized Calendar',
      route: '/dashboard/calendar',
      description: 'Prioritized calendar and risk forecasting for all upcoming deadlines and milestones.',
      features: [
        'Monthly Calendar: Interactive day cells with color-coded urgency dots.',
        'Deadline Risk Scoring (0–100): Calculated from days remaining (50%), preparation workflow stage (30%), and missing vault documents (20%).',
        'Urgency Tiers: Critical (<= 5 days), Urgent (<= 14 days), Upcoming (> 14 days).',
        'Personal Milestone Scheduler: Add custom reminders for visiting the Tehsil office, getting marksheet attestation, etc.',
        'Your GRANTLY Briefing Widget: Dashboard widget summarizing top daily priorities.',
      ],
    },
  ],
  routes: [
    { path: '/', description: 'Public Landing Page with hero, 4-step process, feature showcase, and live product preview.' },
    { path: '/how-it-works', description: 'Deep-dive architectural breakdown of deterministic rules and all 6 modules.' },
    { path: '/scholarships', description: 'Public catalog of verified scholarships with real-time filters and search.' },
    { path: '/scholarships/:id', description: 'Comprehensive scholarship details, benefits, requirements, and official source links.' },
    { path: '/login', description: 'Student login with email, password show/hide, validation, and 1-Click Demo launcher.' },
    { path: '/register', description: 'Student registration with name, email, password, confirm password validation.' },
    { path: '/forgot-password', description: 'Password reset recovery request flow.' },
    { path: '/onboarding', description: '5-step guided onboarding to create the student profile.' },
    { path: '/dashboard', description: 'Main command center with executive stat cards, briefing widget, and top matches.' },
    { path: '/dashboard/profile', description: 'Full student profile editor with completeness meter and missing field warnings.' },
    { path: '/dashboard/discover', description: 'Personalized discovery with Best Matches, Explore More, and Closing Soon.' },
    { path: '/dashboard/eligibility/:id', description: 'Explainable rule evaluation breakdown, What-If simulator, and Opportunity Recovery.' },
    { path: '/dashboard/applications', description: 'Application Command Center with Kanban, Table, reference numbers, and Next Best Action.' },
    { path: '/dashboard/documents', description: 'Smart Document Vault with drag & drop uploads and Document Reuse Intelligence.' },
    { path: '/dashboard/calendar', description: 'Deadline Intelligence calendar with risk scores and custom reminder creation.' },
    { path: '/dashboard/assistant', description: 'Ask GRANTLY AI conversational chatbot.' },
    { path: '/dashboard/notifications', description: 'In-app notification center for deadline alerts, document updates, and status changes.' },
    { path: '/dashboard/settings', description: 'Account settings, data export (JSON backup), and demo environment reset tool.' },
  ],
  faqs: [
    {
      q: 'How does GRANTLY decide if I am eligible?',
      a: 'GRANTLY uses a deterministic mathematical rule engine. It compares your profile (percentage, annual income, domicile state, degree level, and social category) against official requirements published by government and CSR authorities. We do not use generative AI to guess eligibility, ensuring 100% accuracy.',
    },
    {
      q: 'What is the What-If Simulator?',
      a: 'The What-If Simulator is an interactive lab in the Eligibility section where you can adjust your score or income slider to see how it affects your eligibility in real time. These changes stay in memory and do not overwrite your real profile unless you explicitly click "Save to Profile".',
    },
    {
      q: 'What is Document Reuse Intelligence?',
      a: 'Document Reuse Intelligence analyzes your uploaded documents in the Vault (such as your 12th Marksheet or Aadhaar Card) and shows you every scholarship in the catalog where that document fulfills a mandatory requirement. You upload once, and it automatically satisfies multiple schemes.',
    },
    {
      q: 'What does the Deadline Risk Score mean?',
      a: 'The Deadline Risk Score ranges from 0 to 100. It measures how urgent an opportunity is by factoring in remaining days until closure, your application progress stage, and whether you still have missing documents in your vault.',
    },
    {
      q: 'Can I delete my saved scholarships, applications, or uploaded documents?',
      a: 'Yes! You can delete or withdraw any application from the Kanban or Table menu, remove uploaded documents from the Document Vault, delete notifications, or delete personal calendar reminders. Deleted items are permanently removed from storage.',
    },
  ],
};
