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
  payAmount: number;
  status: "open" | "assigned" | "submitted" | "approved" | "rejected";
  assignedTo?: string; // worker id
  dataFields: string[]; // Mock definition of fields to enter
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  workerId: string;
  submittedAt: string;
  content: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
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
    title: "Digitize Invoice #2024-001", 
    description: "Transcribe the items, quantities, and prices from the attached invoice image.", 
    payAmount: 2.50, 
    status: "open", 
    dataFields: ["Invoice Number", "Date", "Total Amount", "Vendor Name"], 
    createdAt: "2024-02-10T10:00:00Z" 
  },
  { 
    id: "t2", 
    title: "Handwritten Note Transcription", 
    description: "Convert the handwritten meeting notes into text format.", 
    payAmount: 5.00, 
    status: "open", 
    dataFields: ["Date", "Attendees", "Key Points", "Action Items"], 
    createdAt: "2024-02-11T09:30:00Z" 
  },
  { 
    id: "t3", 
    title: "Product Catalog Update", 
    description: "Verify and update product specifications for the electronics category.", 
    payAmount: 1.75, 
    status: "assigned", 
    assignedTo: "u2",
    dataFields: ["Product ID", "Name", "Specs Verified (Y/N)"], 
    createdAt: "2024-02-12T14:15:00Z" 
  },
  { 
    id: "t4", 
    title: "Medical Form Entry", 
    description: "Enter patient intake form data into the secure system fields.", 
    payAmount: 8.00, 
    status: "submitted", 
    assignedTo: "u2",
    dataFields: ["Patient ID", "DOB", "Symptoms", "Insurance Provider"], 
    createdAt: "2024-02-09T08:00:00Z" 
  },
   { 
    id: "t5", 
    title: "Survey Response Entry", 
    description: "Digitize customer satisfaction survey responses from Q1.", 
    payAmount: 0.50, 
    status: "approved", 
    assignedTo: "u3",
    dataFields: ["Survey ID", "Rating", "Comments"], 
    createdAt: "2024-02-08T11:00:00Z" 
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "s1",
    taskId: "t4",
    workerId: "u2",
    submittedAt: "2024-02-12T16:00:00Z",
    content: { "Patient ID": "P-9923", "DOB": "1985-04-12", "Symptoms": "Headache", "Insurance Provider": "BlueCross" },
    status: "pending"
  },
  {
    id: "s2",
    taskId: "t5",
    workerId: "u3",
    submittedAt: "2024-02-08T13:30:00Z",
    content: { "Survey ID": "S-101", "Rating": "5", "Comments": "Great service!" },
    status: "approved"
  }
];

// Zustand Store for simple state management in mockup
interface AppState {
  currentUser: User | null;
  tasks: Task[];
  submissions: Submission[];
  login: (email: string, role: "admin" | "worker") => void;
  logout: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  assignTask: (taskId: string, workerId: string) => void;
  submitTask: (taskId: string, content: Record<string, string>) => void;
  reviewSubmission: (submissionId: string, status: "approved" | "rejected", feedback?: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  tasks: MOCK_TASKS,
  submissions: MOCK_SUBMISSIONS,
  
  login: (email, role) => {
    // Mock login - just finds first user with that role for demo
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

  submitTask: (taskId, content) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || !state.currentUser) return state;

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      workerId: state.currentUser.id,
      submittedAt: new Date().toISOString(),
      content,
      status: "pending"
    };

    return {
      submissions: [...state.submissions, newSubmission],
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "submitted" } : t)
    };
  }),

  reviewSubmission: (submissionId, status, feedback) => set((state) => {
    const submission = state.submissions.find(s => s.id === submissionId);
    if (!submission) return state;

    // Update submission status
    const updatedSubmissions = state.submissions.map(s => 
      s.id === submissionId ? { ...s, status, feedback } : s
    );

    // Update task status
    const updatedTasks = state.tasks.map(t => 
      t.id === submission.taskId ? { ...t, status: status === "approved" ? "approved" : "rejected" } : t
    );

    // If approved, add balance to worker (mock logic)
    if (status === "approved") {
      // In a real app we'd update the specific user in the DB. 
      // Here we just update if it's the current user for visual feedback
      if (state.currentUser?.id === submission.workerId) {
        const task = state.tasks.find(t => t.id === submission.taskId);
        return {
          submissions: updatedSubmissions,
          tasks: updatedTasks,
          currentUser: { ...state.currentUser, balance: state.currentUser.balance + (task?.payAmount || 0) }
        };
      }
    }

    return { submissions: updatedSubmissions, tasks: updatedTasks };
  })
}));
