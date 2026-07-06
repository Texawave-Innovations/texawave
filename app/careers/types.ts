export interface Job {
  id: string;
  title: string;
  department: string; // "Software" | "Electrical" | "Mechanical" | "Procurement"
  location: string;
  type: string; // "Full Time" | "Internship" | "Contract" | "Part Time"
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  deadline: string;
  status: "Open" | "Closed";
  isFeatured: boolean;
  isUrgent: boolean;
  isInternship: boolean;
  postedDate: string;
}

export interface WalkInDrive {
  id: string;
  title: string;
  date: string;
  location: string;
  positions: string[];
  description: string;
  contactEmail: string;
}

export interface CareerUpdate {
  id: string;
  type: "update" | "life"; // "update" for general company announcements, "life" for team culture/events
  title: string;
  content: string;
  image?: string;
  date: string;
  likes: number;
  commentsCount: number;
}

export interface Application {
  id: string;
  jobId: string; // "general" or specific job ID
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeName: string;
  resumeData?: string; // Simulated base64 or placeholder content
  message: string;
  dateApplied: string;
  status: "New" | "Shortlisted" | "Interview Scheduled" | "Selected" | "Rejected";
  skills?: string[]; // Candidate skills for talent pool
  deptInterest?: string; // Candidate department interest for talent pool
}
