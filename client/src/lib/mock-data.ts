import { create } from "zustand";

// --- DATA MODELS (Logical Separation) ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker";
  balance: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  payPerRow: number;
  status: "open" | "assigned" | "submitted" | "approved" | "rejected";
  assignedTo?: string; // Reference to User.id
  dataFields: string[];
  maxRows: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string; // Reference to Task.id
  workerId: string; // Reference to User.id
  submittedAt: string;
  fileName: string;
  rowCount: number;
  previewData: any[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface Earning {
  id: string;
  submissionId: string; // Reference to Submission.id
  workerId: string; // Reference to User.id
  amount: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  workerId: string; // Reference to User.id
  earningIds: string[]; // Reference to Earning.ids included in this payout
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface Notification {
  id: string;
  userId: string; // Reference to User.id
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  relatedId?: string; // Reference to Task, Submission, or Payout
  read: boolean;
  createdAt: string;
}

// --- MOCK DATA ---

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Admin User", email: "admin@dataentry.pro", role: "admin", balance: 0 },
  { id: "u2", name: "Sarah Worker", email: "sarah@worker.com", role: "worker", balance: 125.50 },
  { id: "u3", name: "John Data", email: "john@worker.com", role: "worker", balance: 45.00 },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: "t1", 
    title: "Invoice Batch Processing", 
    description: "Upload CSV with Invoice Number, Date, and Amount.", 
    payPerRow: 0.25, 
    status: "open", 
    dataFields: ["Invoice Number", "Date", "Amount"], 
    maxRows: 100,
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
  
  // Auth
  login: (email: string, role: "admin" | "worker") => void;
  logout: () => void;
  
  // Task Management
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  assignTask: (taskId: string, workerId: string) => void;
  
  // Submission & Earnings
  submitTask: (taskId: string, fileName: string, data: any[]) => void;
  reviewSubmission: (submissionId: string, status: "approved" | "rejected", reason?: string) => void;
  
  // Payouts
  markAsPaid: (payoutId: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification["type"], relatedId?: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: MOCK_USERS[1], // Default for demo
  tasks: MOCK_TASKS,
  submissions: [],
  earnings: [],
  payouts: [
    { id: "p1", workerId: "u2", earningIds: [], amount: 50.00, status: "paid", createdAt: "2024-02-01T10:00:00Z", paidAt: "2024-02-02T14:00:00Z" },
    { id: "p2", workerId: "u2", earningIds: [], amount: 75.50, status: "pending", createdAt: "2024-02-14T09:00:00Z" }
  ],
  notifications: [
    { id: "n1", userId: "u2", title: "Welcome!", message: "Thanks for joining DataEntry Pro.", type: "info", read: false, createdAt: new Date().toISOString() }
  ],
  
  login: (email, role) => {
    const user = MOCK_USERS.find(u => u.role === role) || 
                { id: "new", name: "Demo User", email, role, balance: 0 };
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

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
    let newBalance = state.currentUser?.id === submission.workerId ? state.currentUser.balance : 0; // Simplified for mockup
    
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
      
      // If the worker is currently logged in, update their local balance for immediate UI feedback
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
