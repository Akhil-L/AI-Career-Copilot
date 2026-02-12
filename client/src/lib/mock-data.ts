import { create } from "zustand";
import { CONFIG } from "./config";

// --- DATA MODELS ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker";
  balance: number;
  completedModules: string[]; // Track training progress
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  payPerRow: number;
  status: "open" | "assigned" | "submitted" | "approved" | "rejected";
  assignedTo?: string; 
  dataFields: string[];
  maxRows: number;
  createdAt: string;
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
    title: "Intro to Data Entry",
    description: "Learn the fundamentals of professional data entry.",
    content: "Professional data entry is about speed and accuracy. At DataEntry Pro, we process thousands of records daily. Your role is to ensure that the digital records match the source material perfectly. Consistency in formatting is key to high-quality data.",
    quiz: {
      question: "What is the most important aspect of data entry at DataEntry Pro?",
      options: ["Speed only", "Both speed and accuracy", "Using a fancy keyboard", "Working at night"],
      correctAnswer: 1
    }
  },
  {
    id: "m2",
    title: "Platform Workflow",
    description: "How to find and complete work.",
    content: "Our workflow follows a simple cycle: 1. Browse Available Jobs. 2. Accept a Task (Assigned). 3. Perform the work and upload your file (Submitted). 4. Admin reviews your work (Approved/Rejected). Once approved, earnings are credited to your balance.",
    quiz: {
      question: "What is the status of a task after you upload your file?",
      options: ["Open", "Assigned", "Submitted", "Paid"],
      correctAnswer: 2
    }
  },
  {
    id: "m3",
    title: "Formatting & Validation",
    description: "CSV and XLSX requirements.",
    content: "We strictly accept CSV and XLSX files. Every task has 'Required Columns'. Your file MUST contain these headers exactly as spelled. Files missing headers or exceeding the row limit will be automatically rejected by our validation system.",
    quiz: {
      question: "Which file formats does the platform accept?",
      options: [".txt and .doc", ".pdf and .jpg", ".csv and .xlsx", ".zip only"],
      correctAnswer: 2
    }
  },
  {
    id: "m4",
    title: "Earnings & Payouts",
    description: "Getting paid for your work.",
    content: "You are paid per row of valid data. Earnings move to 'Pending' as soon as a submission is approved. Admins release payouts regularly. You can track your full history in the 'Payouts' section of your dashboard.",
    quiz: {
      question: "When are earnings added to your pending payouts?",
      options: ["As soon as you upload", "After admin approval", "At the end of the month", "When you accept a task"],
      correctAnswer: 1
    }
  }
];

// --- MOCK DATA ---

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin User", email: "admin@dataentry.pro", role: "admin", balance: 0, completedModules: [] },
  { id: "u2", name: "Sarah Worker", email: "sarah@worker.com", role: "worker", balance: 125.50, completedModules: ["m1"] },
  { id: "u3", name: "John Data", email: "john@worker.com", role: "worker", balance: 45.00, completedModules: [] },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: "t1", 
    title: "Invoice Batch Processing", 
    description: "Upload CSV with Invoice Number, Date, and Amount.", 
    payPerRow: 0.25, 
    status: "open", 
    dataFields: ["Invoice Number", "Date", "Amount"], 
    maxRows: CONFIG.DEFAULT_MAX_ROWS,
    createdAt: "2024-02-10T10:00:00Z" 
  },
  { 
    id: "t2", 
    title: "Inventory Log Update", 
    description: "Update product stock levels via Excel file.", 
    payPerRow: 0.15, 
    status: "assigned", 
    assignedTo: "u2",
    dataFields: ["Product ID", "Quantity", "Warehouse"], 
    maxRows: 50,
    createdAt: "2024-02-11T09:30:00Z" 
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
  
  login: (email: string, role: "admin" | "worker") => void;
  logout: () => void;
  
  completeModule: (moduleId: string) => void;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
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
                { id: "new", name: "Demo User", email, role, balance: 0, completedModules: [] };
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

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
