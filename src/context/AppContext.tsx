import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Scholarship,
  Application,
  VaultDocument,
  AppNotification,
  CalendarEvent,
  ApplicationStatus,
} from '../types';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_DOCUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
} from '../data/initialData';
import { triggerSubmissionConfetti } from '../utils/confetti';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  requestPasswordReset: (email: string) => { success: boolean; message: string };

  // Student Profile
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  profileCompleteness: number;

  // Scholarships Catalog
  scholarships: Scholarship[];
  savedScholarshipIds: string[];
  toggleSaveScholarship: (scholarshipId: string) => void;
  removeSavedScholarship: (scholarshipId: string) => boolean;
  isScholarshipSaved: (scholarshipId: string) => boolean;

  // Applications Command Center
  applications: Application[];
  createApplication: (scholarshipId: string) => Application;
  updateApplicationStatus: (
    applicationId: string,
    newStatus: ApplicationStatus,
    referenceNumber?: string,
    notes?: string
  ) => void;
  updateApplicationNotes: (applicationId: string, notes: string) => void;
  deleteApplication: (applicationId: string) => boolean;

  // Document Vault
  vaultDocuments: VaultDocument[];
  uploadVaultDocument: (newDoc: Omit<VaultDocument, 'id' | 'uploadedAt' | 'userId'>) => void;
  deleteVaultDocument: (documentId: string) => boolean;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => boolean;
  clearAllNotifications: () => boolean;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Calendar & Reminders
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (eventId: string) => boolean;
  toggleCalendarEventCompleted: (eventId: string) => void;

  // Demo Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'grantly_profile_v1',
  APPLICATIONS: 'grantly_apps_v1',
  DOCUMENTS: 'grantly_docs_v1',
  SAVED_IDS: 'grantly_saved_v1',
  NOTIFICATIONS: 'grantly_notifs_v1',
  CALENDAR: 'grantly_calendar_v1',
  AUTH: 'grantly_auth_v1',
  ACCOUNTS: 'grantly_accounts_v1',
};

// Default demonstration user account
const DEMO_ACCOUNT: UserAccount = {
  id: 'demo-student-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.edu.in',
  password: 'password123',
  createdAt: '2026-10-01T00:00:00.000Z',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure default demo account exists in accounts store
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (stored) {
      try {
        const parsed: UserAccount[] = JSON.parse(stored);
        if (!parsed.some((a) => a.email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase())) {
          return [DEMO_ACCOUNT, ...parsed];
        }
        return parsed;
      } catch (e) {
        return [DEMO_ACCOUNT];
      }
    }
    return [DEMO_ACCOUNT];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated && parsed.user) {
          return parsed.user;
        }
      } catch (e) {
        return DEMO_ACCOUNT;
      }
    }
    // Default active session for demonstration
    return DEMO_ACCOUNT;
  });

  const isAuthenticated = !!currentUser;

  // Login handler
  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!existing) {
      return { success: false, error: 'No account registered with this email address.' };
    }

    if (password && existing.password && existing.password !== password) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    setCurrentUser(existing);
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ isAuthenticated: true, user: existing })
    );

    addNotification({
      title: 'Welcome Back',
      message: `Signed in as ${existing.name}. Your workspace is active.`,
      type: 'system',
      link: '/dashboard',
    });

    return { success: true };
  };

  // Register handler
  const register = (
    name: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: 'Full legal name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check duplicate
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      };
    }

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ isAuthenticated: true, user: newAccount })
    );

    // Initialize clean student profile
    const newProfile: StudentProfile = {
      ...INITIAL_STUDENT_PROFILE,
      id: newAccount.id,
      fullName: cleanName,
      email: cleanEmail,
      isOnboarded: false,
      updatedAt: new Date().toISOString(),
    };

    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));

    addNotification({
      title: 'Account Created',
      message: `Welcome to GRANTLY, ${cleanName}! Please complete your 5-step onboarding profile.`,
      type: 'profile',
      link: '/onboarding',
    });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ isAuthenticated: false, user: null })
    );
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.some((a) => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      return {
        success: false,
        message: 'No registered student account was found with this email.',
      };
    }
    return {
      success: true,
      message: `A password reset instruction link has been sent to ${cleanEmail}. Please check your inbox.`,
    };
  };

  // Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STUDENT_PROFILE;
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Profile completeness calculation
  const profileCompleteness = React.useMemo(() => {
    const fields = [
      profile.fullName,
      profile.dateOfBirth,
      profile.state,
      profile.district,
      profile.educationLevel,
      profile.institution,
      profile.course,
      profile.academicScore,
      profile.annualFamilyIncome,
      profile.category,
    ];
    const filled = fields.filter((f) => f !== undefined && f !== null && f !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  // Scholarships catalog
  const scholarships = SCHOLARSHIPS_DATA;

  // Saved scholarships
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    return saved ? JSON.parse(saved) : ['reliance-ug-2025', 'csss-national-2025', 'kalam-student-research-grant'];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  const toggleSaveScholarship = (scholarshipId: string) => {
    setSavedScholarshipIds((prev) => {
      if (prev.includes(scholarshipId)) {
        return prev.filter((id) => id !== scholarshipId);
      } else {
        addNotification({
          title: 'Scholarship Opportunity Saved',
          message: 'Saved to your personal discovery watchlist. You can start application preparation anytime.',
          type: 'application',
          link: '/dashboard/applications',
        });
        return [...prev, scholarshipId];
      }
    });
  };

  const removeSavedScholarship = (scholarshipId: string): boolean => {
    setSavedScholarshipIds((prev) => prev.filter((id) => id !== scholarshipId));
    return true;
  };

  const isScholarshipSaved = (id: string) => savedScholarshipIds.includes(id);

  // Applications state
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_APPLICATIONS;
      }
    }
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  const createApplication = (scholarshipId: string): Application => {
    const existing = applications.find((a) => a.scholarshipId === scholarshipId);
    if (existing) return existing;

    const scholarship = scholarships.find((s) => s.id === scholarshipId);
    if (!scholarship) throw new Error('Scholarship not found');

    const newApp: Application = {
      id: `app-${Date.now()}`,
      scholarshipId,
      scholarship,
      status: 'Saved',
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextAction: 'Review document requirements and initialize preparation.',
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Workspace Initialized',
          description: `Created application tracking workspace for ${scholarship.title}`,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    if (!savedScholarshipIds.includes(scholarshipId)) {
      setSavedScholarshipIds((prev) => [...prev, scholarshipId]);
    }

    addNotification({
      title: 'Application Workspace Created',
      message: `Started workspace for ${scholarship.title}. Document checklist is ready.`,
      type: 'application',
      link: '/dashboard/applications',
    });

    return newApp;
  };

  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    referenceNumber?: string,
    notes?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const newHistory = [
          ...app.history,
          {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: `Status Changed to ${newStatus}`,
            description: notes || `Application moved from ${app.status} to ${newStatus}`,
          },
        ];

        return {
          ...app,
          status: newStatus,
          referenceNumber: referenceNumber !== undefined ? referenceNumber : app.referenceNumber,
          notes: notes !== undefined ? notes : app.notes,
          submittedAt: newStatus === 'Submitted' && !app.submittedAt ? new Date().toISOString() : app.submittedAt,
          updatedAt: new Date().toISOString(),
          history: newHistory,
        };
      })
    );

    if (newStatus === 'Submitted') {
      try {
        triggerSubmissionConfetti();
      } catch (err) {
        console.warn('Confetti animation failed:', err);
      }
    }

    addNotification({
      title: newStatus === 'Submitted' ? '🎉 Application Submitted!' : 'Application Status Updated',
      message:
        newStatus === 'Submitted'
          ? 'Congratulations! Your scholarship application has been marked as Submitted. Good luck!'
          : `Your application has transitioned to ${newStatus}.`,
      type: 'application',
      link: '/dashboard/applications',
    });
  };

  const updateApplicationNotes = (applicationId: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, notes, updatedAt: new Date().toISOString() } : app))
    );
  };

  const deleteApplication = (applicationId: string): boolean => {
    const target = applications.find((a) => a.id === applicationId);
    setApplications((prev) => {
      const updated = prev.filter((a) => a.id !== applicationId);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
      return updated;
    });

    // Also remove any linked calendar events
    setCalendarEvents((prev) => {
      const updated = prev.filter((e) => e.scholarshipId !== target?.scholarshipId);
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(updated));
      return updated;
    });

    addNotification({
      title: 'Application Withdrawn',
      message: `Workspace record for "${target?.scholarship.title || 'Scholarship'}" has been permanently deleted.`,
      type: 'application',
      link: '/dashboard/applications',
    });

    return true;
  };

  // Documents Vault
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DOCUMENTS;
      }
    }
    return INITIAL_DOCUMENTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(vaultDocuments));
  }, [vaultDocuments]);

  const uploadVaultDocument = (newDoc: Omit<VaultDocument, 'id' | 'uploadedAt' | 'userId'>) => {
    const created: VaultDocument = {
      ...newDoc,
      id: `doc-${Date.now()}`,
      userId: profile.id,
      uploadedAt: new Date().toISOString(),
    };

    setVaultDocuments((prev) => [created, ...prev]);

    addNotification({
      title: 'Document Uploaded to Vault',
      message: `"${created.customTitle}" is now stored securely and available for smart requirement reuse.`,
      type: 'document',
      link: '/dashboard/documents',
    });
  };

  const deleteVaultDocument = (documentId: string): boolean => {
    const target = vaultDocuments.find((d) => d.id === documentId);
    setVaultDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== documentId);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
      return updated;
    });

    addNotification({
      title: 'Document Deleted from Vault',
      message: `"${target?.customTitle || 'Document'}" was removed from your vault. Requirement readiness updated.`,
      type: 'document',
      link: '/dashboard/documents',
    });

    return true;
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string): boolean => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const clearAllNotifications = (): boolean => {
    setNotifications([]);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    return true;
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const item: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // Calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CALENDAR_EVENTS;
      }
    }
    return INITIAL_CALENDAR_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const item: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      isCompleted: false,
    };
    setCalendarEvents((prev) => [item, ...prev]);
  };

  const deleteCalendarEvent = (eventId: string): boolean => {
    setCalendarEvents((prev) => {
      const updated = prev.filter((e) => e.id !== eventId);
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const toggleCalendarEventCompleted = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isCompleted: !e.isCompleted } : e))
    );
  };

  // Resettable Demo Environment
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_IDS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);

    setCurrentUser(DEMO_ACCOUNT);
    setProfile(INITIAL_STUDENT_PROFILE);
    setApplications(INITIAL_APPLICATIONS);
    setVaultDocuments(INITIAL_DOCUMENTS);
    setSavedScholarshipIds(['reliance-ug-2025', 'csss-national-2025', 'kalam-student-research-grant']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);

    addNotification({
      title: 'Demo Environment Reset',
      message: 'Platform state restored to clean demonstration dataset with verified opportunities.',
      type: 'system',
      link: '/dashboard',
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        register,
        requestPasswordReset,
        profile,
        updateProfile,
        profileCompleteness,
        scholarships,
        savedScholarshipIds,
        toggleSaveScholarship,
        removeSavedScholarship,
        isScholarshipSaved,
        applications,
        createApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        deleteApplication,
        vaultDocuments,
        uploadVaultDocument,
        deleteVaultDocument,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        toggleCalendarEventCompleted,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
