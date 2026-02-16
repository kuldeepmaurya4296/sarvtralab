export interface AnalyticsData {
  totalStudents: number;
  totalSchools: number;
  totalCourses: number;
  totalRevenue: number;
  activeUsers: number;
  completionRate: number;
}

export interface TimeSeriesData {
  date: string;
  students: number;
  schools: number;
  revenue: number;
  completions: number;
}

export interface StudentProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
  timeSpent: number; // in minutes
  quizScore: number;
}

export interface WatchTimeData {
  day: string;
  minutes: number;
}

export interface SchoolAnalytics {
  totalStudents: number;
  activeStudents: number;
  coursesAssigned: number;
  averageProgress: number;
  topPerformers: string[];
  completionRate: number;
}

// Super Admin Analytics
export const superAdminAnalytics: AnalyticsData = {
  totalStudents: 15420,
  totalSchools: 128,
  totalCourses: 12,
  totalRevenue: 45678900,
  activeUsers: 8750,
  completionRate: 78.5
};

export const weeklyData: TimeSeriesData[] = [
  { date: 'Mon', students: 1250, schools: 12, revenue: 450000, completions: 45 },
  { date: 'Tue', students: 1320, schools: 8, revenue: 520000, completions: 52 },
  { date: 'Wed', students: 1180, schools: 15, revenue: 380000, completions: 38 },
  { date: 'Thu', students: 1450, schools: 10, revenue: 620000, completions: 65 },
  { date: 'Fri', students: 1380, schools: 18, revenue: 580000, completions: 58 },
  { date: 'Sat', students: 890, schools: 5, revenue: 250000, completions: 28 },
  { date: 'Sun', students: 720, schools: 3, revenue: 180000, completions: 22 }
];

export const monthlyData: TimeSeriesData[] = [
  { date: 'Jan', students: 12500, schools: 85, revenue: 4500000, completions: 450 },
  { date: 'Feb', students: 13200, schools: 92, revenue: 5200000, completions: 520 },
  { date: 'Mar', students: 11800, schools: 88, revenue: 4800000, completions: 380 },
  { date: 'Apr', students: 14500, schools: 102, revenue: 6200000, completions: 650 },
  { date: 'May', students: 13800, schools: 98, revenue: 5800000, completions: 580 },
  { date: 'Jun', students: 8900, schools: 75, revenue: 3500000, completions: 280 },
  { date: 'Jul', students: 7200, schools: 68, revenue: 2800000, completions: 220 },
  { date: 'Aug', students: 15200, schools: 115, revenue: 7200000, completions: 720 },
  { date: 'Sep', students: 16800, schools: 122, revenue: 8100000, completions: 810 },
  { date: 'Oct', students: 15600, schools: 118, revenue: 7500000, completions: 750 },
  { date: 'Nov', students: 14200, schools: 112, revenue: 6800000, completions: 680 },
  { date: 'Dec', students: 11500, schools: 95, revenue: 4200000, completions: 420 }
];

export const yearlyData: TimeSeriesData[] = [
  { date: '2022', students: 45000, schools: 45, revenue: 25000000, completions: 2500 },
  { date: '2023', students: 89000, schools: 85, revenue: 52000000, completions: 5800 },
  { date: '2024', students: 142000, schools: 128, revenue: 85000000, completions: 12500 },
  { date: '2025', students: 15420, schools: 128, revenue: 45678900, completions: 4520 }
];

// Student Analytics
export const studentProgress: StudentProgress[] = [
  {
    courseId: 'foundation-robotics-3m',
    courseName: 'Foundation Maker Track - 3 Months',
    progress: 65,
    completedLessons: 8,
    totalLessons: 12,
    lastAccessed: '2025-02-02',
    timeSpent: 1250,
    quizScore: 85
  }
];

export const studentWatchTime: WatchTimeData[] = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 75 },
  { day: 'Fri', minutes: 55 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 40 }
];

// School Analytics
export const schoolAnalyticsData: SchoolAnalytics = {
  totalStudents: 245,
  activeStudents: 198,
  coursesAssigned: 3,
  averageProgress: 72,
  topPerformers: ['Priya Sharma', 'Arjun Patel', 'Neha Singh'],
  completionRate: 68
};

export const gradeDistribution = [
  { grade: 'Class 4', students: 35 },
  { grade: 'Class 5', students: 42 },
  { grade: 'Class 6', students: 48 },
  { grade: 'Class 7', students: 38 },
  { grade: 'Class 8', students: 45 },
  { grade: 'Class 9', students: 22 },
  { grade: 'Class 10', students: 15 }
];

export const courseEnrollment = [
  { course: 'Foundation 3M', enrolled: 85, completed: 45 },
  { course: 'Foundation 6M', enrolled: 62, completed: 28 },
  { course: 'Intermediate 3M', enrolled: 55, completed: 18 },
  { course: 'Intermediate 6M', enrolled: 28, completed: 8 },
  { course: 'Advanced 9M', enrolled: 15, completed: 2 }
];
