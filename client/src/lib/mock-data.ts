import { create } from "zustand";
import { CONFIG } from "./config";

// --- DATA MODELS ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker" | "client";
  balance: number;
  completedModules: string[]; // Track training progress
  moduleAttempts: Record<string, number>; // moduleId -> attemptCount
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: QuizQuestion[];
  passingScore: number; // e.g., 0.8 for 80%
  maxAttempts: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  payPerRow: number;
  status: "pending_review" | "open" | "assigned" | "submitted" | "approved" | "rejected";
  clientId?: string; // NEW: Reference to User.id (client)
  assignedTo?: string; 
  dataFields: string[];
  maxRows: number;
  createdAt: string;
  sourceDataUrl?: string; 
  validWarehouseNames?: string[]; 
}

export interface Submission {
  id: string;
  taskId: string;
  workerId: string;
  submittedAt: string;
  fileName: string;
  rowCount: number;
  previewData: any[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface Earning {
  id: string;
  submissionId: string;
  workerId: string;
  amount: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  workerId: string;
  earningIds: string[];
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// --- TRAINING DATA ---

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "m1",
    title: "Intro to Data Entry & Accuracy Auditing",
    description: "Fundamentals and quality control techniques.",
    content: `Professional data entry is built on accuracy...`,
    quiz: [
      {
        question: "What is the 'Scan & Verify' method?",
        options: ["Scanning the file for viruses", "Scanning the source then verifying the entry", "Using a barcode scanner", "Quickly glancing at the headers"],
        correctAnswer: 1,
        explanation: "Scan & Verify involves looking at the original source material and confirming the digital entry matches it perfectly."
      },
      {
        question: "Which of these is a 'transposed number' error?",
        options: ["Entering 100 instead of 200", "Entering 'John' instead of 'Jon'", "Entering 1234 instead of 1243", "Leaving a field empty"],
        correctAnswer: 2,
        explanation: "Transposition occurs when two digits or characters are swapped accidentally."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m2",
    title: "Detecting Duplicates & Inconsistencies",
    description: "Ensuring data integrity in bulk sets.",
    content: `Data Integrity is vital...`,
    quiz: [
      {
        question: "How should you handle inconsistent country names like 'USA' and 'United States'?",
        options: ["Leave them as they are", "Delete all of them", "Standardize them to the format in task instructions", "Choose whichever you like best"],
        correctAnswer: 2,
        explanation: "Standardization ensures data is usable and professional."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m3",
    title: "Handling Messy or Unclear Data",
    description: "Strategies for low-quality source material.",
    content: `Unclear Source...`,
    quiz: [
      {
        question: "What should you do if a source scan is illegible?",
        options: ["Make your best guess", "Leave it blank without checking rules", "Follow task rules for 'N/A' or flag it", "Skip the entire row"],
        correctAnswer: 2,
        explanation: "Guessing leads to data errors. Always follow specific fallback instructions provided by the Admin."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  },
  {
    id: "m4",
    title: "Data Privacy & Ethical Handling",
    description: "Confidentiality and client information safety.",
    content: `Privacy...`,
    quiz: [
      {
        question: "Is it acceptable to save a copy of client data for your personal records?",
        options: ["Yes, for portfolio use", "Only if it doesn't contain names", "Never, it's a breach of confidentiality", "Only if the task is finished"],
        correctAnswer: 2,
        explanation: "Confidentiality is a legal and ethical requirement. Client data must never leave the secure platform environment."
      }
    ],
    passingScore: 1.0,
    maxAttempts: 3
  }
];

// --- MOCK DATA ---

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin User", email: "admin@dataentry.pro", role: "admin", balance: 0, completedModules: [], moduleAttempts: {} },
  { id: "u2", name: "Sarah Worker", email: "sarah@worker.com", role: "worker", balance: 125.50, completedModules: ["m1", "m2", "m3", "m4"], moduleAttempts: { "m1": 1, "m2": 1, "m3": 1, "m4": 1 } },
  { id: "u3", name: "John Data", email: "john@worker.com", role: "worker", balance: 45.00, completedModules: [], moduleAttempts: {} },
  { id: "u4", name: "Acme Corp", email: "client@acme.com", role: "client", balance: 0, completedModules: [], moduleAttempts: {} },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: "t1", 
    title: "Invoice Batch Processing", 
    description: "Download the source invoice list and format into CSV with required headers.", 
    payPerRow: 0.25, 
    status: "open", 
    dataFields: ["Invoice Number", "Date", "Amount"], 
    maxRows: CONFIG.DEFAULT_MAX_ROWS,
    createdAt: "2024-02-10T10:00:00Z",
    sourceDataUrl: "/data/invoices_source.pdf",
    clientId: "u4"
  },
  { 
    id: "t2", 
    title: "Inventory Log Update", 
    description: "Process the product stock list. Ensure all Warehouse names are valid.", 
    payPerRow: 0.15, 
    status: "assigned", 
    assignedTo: "u2",
    dataFields: ["Product ID", "Quantity", "Warehouse"], 
    maxRows: 50,
    createdAt: "2024-02-11T09:30:00Z",
    sourceDataUrl: "/data/stock_levels_feb.xlsx",
    validWarehouseNames: ["North-Hub", "East-Terminal", "South-Depot", "Central-Logistics"],
    clientId: "u4"
  }
];

// --- APP STATE ---

interface AppState {
  currentUser: User | null;
  tasks: Task[];
  submissions: Submission[];
  earnings: Earning[];
  payouts: Payout[];
  notifications: Notification[];
  
  login: (email: string, role: "admin" | "worker" | "client") => void;
  logout: () => void;
  
  registerAttempt: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  clientSubmitTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  approveTask: (taskId: string) => void;
  assignTask: (taskId: string, workerId: string) => void;
  submitTask: (taskId: string, fileName: string, data: any[]) => void;
  reviewSubmission: (submissionId: string, status: "approved" | "rejected", reason?: string) => void;
  markAsPaid: (payoutId: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification["type"], relatedId?: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: MOCK_USERS[1], 
  tasks: MOCK_TASKS,
  submissions: [],
  earnings: [],
  payouts: [
    { id: "p1", workerId: "u2", earningIds: [], amount: 50.00, status: "paid", createdAt: "2024-02-01T10:00:00Z", paidAt: "2024-02-02T14:00:00Z" },
    { id: "p2", workerId: "u2", earningIds: [], amount: 75.50, status: "pending", createdAt: "2024-02-14T09:00:00Z" }
  ],
  notifications: [
    { id: "n1", userId: "u2", title: "Welcome!", message: `Thanks for joining ${CONFIG.APP_NAME}.`, type: "info", read: false, createdAt: new Date().toISOString() }
  ],
  
  login: (email, role) => {
    const user = MOCK_USERS.find(u => u.role === role) || 
                { id: "new", name: "Demo User", email, role, balance: 0, completedModules: [], moduleAttempts: {} };
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  registerAttempt: (moduleId) => set((state) => {
    if (!state.currentUser) return state;
    const attempts = { ...state.currentUser.moduleAttempts };
    attempts[moduleId] = (attempts[moduleId] || 0) + 1;
    return {
      currentUser: { ...state.currentUser, moduleAttempts: attempts }
    };
  }),

  completeModule: (moduleId) => set((state) => {
    if (!state.currentUser) return state;
    if (state.currentUser.completedModules.includes(moduleId)) return state;
    
    return {
      currentUser: {
        ...state.currentUser,
        completedModules: [...state.currentUser.completedModules, moduleId]
      }
    };
  }),

  addTask: (taskData) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin') return;
    set((state) => ({
      tasks: [...state.tasks, { 
        ...taskData, 
        id: Math.random().toString(36).substr(2, 9), 
        status: "open", 
        createdAt: new Date().toISOString() 
      }]
    }));
  },

  clientSubmitTask: (taskData) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'client') return;
    set((state) => ({
      tasks: [...state.tasks, { 
        ...taskData, 
        id: Math.random().toString(36).substr(2, 9), 
        status: "pending_review", 
        clientId: currentUser.id,
        createdAt: new Date().toISOString() 
      }]
    }));
  },

  approveTask: (taskId) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin') return;
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "open" } : t)
    }));
  },

  assignTask: (taskId, workerId) => {
    const { currentUser } = get();
    if (currentUser?.role !== 'admin' && currentUser?.id !== workerId) return;
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "assigned", assignedTo: workerId } : t)
    }));
  },

  submitTask: (taskId, fileName, data) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !state.currentUser || task.assignedTo !== state.currentUser.id) return state;
    if (task.status === 'submitted' || task.status === 'approved') return state;

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      workerId: state.currentUser.id,
      submittedAt: new Date().toISOString(),
      fileName,
      rowCount: data.length,
      previewData: data.slice(0, 10),
      status: "pending"
    };

    return {
      submissions: [...state.submissions, newSubmission],
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "submitted" } : t)
    };
  }),

  reviewSubmission: (submissionId, status, reason) => set((state) => {
    if (state.currentUser?.role !== 'admin') return state;
    
    const submission = state.submissions.find(s => s.id === submissionId);
    if (!submission) return state;

    const task = state.tasks.find(t => t.id === submission.taskId);
    if (!task) return state;

    let newEarnings = [...state.earnings];
    let newPayouts = [...state.payouts];
    let newBalance = state.currentUser?.id === submission.workerId ? state.currentUser.balance : 0;
    
    const earningAmount = status === "approved" ? submission.rowCount * task.payPerRow : 0;

    if (status === "approved") {
      const earningId = Math.random().toString(36).substr(2, 9);
      const earning: Earning = {
        id: earningId,
        submissionId: submission.id,
        workerId: submission.workerId,
        amount: earningAmount,
        createdAt: new Date().toISOString()
      };
      newEarnings.push(earning);

      const payoutId = Math.random().toString(36).substr(2, 9);
      newPayouts.push({
        id: payoutId,
        workerId: submission.workerId,
        earningIds: [earningId],
        amount: earningAmount,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      
      if (state.currentUser?.id === submission.workerId) {
        newBalance = state.currentUser.balance + earningAmount;
      }
    }
    
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: submission.workerId,
      title: status === "approved" ? "Task Approved!" : "Task Rejected",
      message: status === "approved" 
        ? `Your submission for "${task.title}" was approved. $${earningAmount.toFixed(2)} added to pending payouts.`
        : `Your submission for "${task.title}" was rejected. Reason: ${reason || "No reason provided."}`,
      type: status === "approved" ? "success" : "warning",
      relatedId: submission.id,
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      earnings: newEarnings,
      payouts: newPayouts,
      notifications: [...state.notifications, notification],
      submissions: state.submissions.map(s => s.id === submissionId ? { ...s, status, rejectionReason: reason } : s),
      tasks: state.tasks.map(t => t.id === submission.taskId ? { ...t, status: status === "approved" ? "approved" : "rejected" } : t),
      currentUser: state.currentUser?.id === submission.workerId ? { ...state.currentUser, balance: newBalance } : state.currentUser
    };
  }),

  markAsPaid: (payoutId) => set((state) => {
    if (state.currentUser?.role !== 'admin') return state;
    
    const payout = state.payouts.find(p => p.id === payoutId);
    if (!payout) return state;

    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: payout.workerId,
      title: "Payout Released",
      message: `Your payout of $${payout.amount.toFixed(2)} has been marked as paid.`,
      type: "success",
      relatedId: payout.id,
      read: false,
      createdAt: new Date().toISOString()
    };

    return {
      payouts: state.payouts.map(p => p.id === payoutId ? { ...p, status: "paid", paidAt: new Date().toISOString() } : p),
      notifications: [...state.notifications, notification]
    };
  }),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  addNotification: (userId, title, message, type, relatedId) => set((state) => ({
    notifications: [...state.notifications, {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      type,
      relatedId,
      read: false,
      createdAt: new Date().toISOString()
    }]
  }))
}));
