import { create } from "zustand";

// Types
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
  assignedTo?: string; // worker id
  dataFields: string[]; // Required columns for validation
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

// Mock Data Store
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
    createdAt: "2024-02-11T09:30:00Z" 
  }
];

export const MOCK_SUBMISSIONS: Submission[] = [];

// Zustand Store for simple state management in mockup
interface AppState {
  currentUser: User | null;
  tasks: Task[];
  submissions: Submission[];
  login: (email: string, role: "admin" | "worker") => void;
  logout: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  assignTask: (taskId: string, workerId: string) => void;
  submitTask: (taskId: string, fileName: string, data: any[]) => void;
  reviewSubmission: (submissionId: string, status: "approved" | "rejected", reason?: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: MOCK_USERS[1], // Start logged in as worker for demo
  tasks: MOCK_TASKS,
  submissions: MOCK_SUBMISSIONS,
  
  login: (email, role) => {
    const user = MOCK_USERS.find(u => u.role === role) || 
                { id: "new", name: "Demo User", email, role, balance: 0 };
    set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  addTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, { 
      ...taskData, 
      id: Math.random().toString(36).substr(2, 9), 
      status: "open", 
      createdAt: new Date().toISOString() 
    }]
  })),

  assignTask: (taskId, workerId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "assigned", assignedTo: workerId } : t)
  })),

  submitTask: (taskId, fileName, data) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !state.currentUser) return state;

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
    const submission = state.submissions.find(s => s.id === submissionId);
    if (!submission) return state;

    const task = state.tasks.find(t => t.id === submission.taskId);
    if (!task) return state;

    const earnings = status === "approved" ? submission.rowCount * task.payPerRow : 0;

    return {
      submissions: state.submissions.map(s => 
        s.id === submissionId ? { ...s, status, rejectionReason: reason } : s
      ),
      tasks: state.tasks.map(t => 
        t.id === submission.taskId ? { ...t, status: status === "approved" ? "approved" : "rejected" } : t
      ),
      currentUser: state.currentUser?.id === submission.workerId 
        ? { ...state.currentUser, balance: state.currentUser.balance + earnings }
        : state.currentUser
    };
  })
}));
