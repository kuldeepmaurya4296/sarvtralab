
export interface Course {
  id: string;
  title: string;
  description: string;
  grade: string;
  duration: string;
  sessions: number;
  totalHours: number;
  price: number;
  originalPrice: number;
  emiAvailable: boolean;
  emiAmount?: number;
  emiMonths?: number;
  image: string;
  category: 'foundation' | 'intermediate' | 'advanced';
  tags: string[];
  features: string[];
  curriculum: CurriculumModule[];
  rating: number;
  studentsEnrolled: number;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CurriculumModule {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz' | 'project';
  isCompleted?: boolean;
  videoUrl?: string; // YouTube video URL
}

export const courses: Course[] = [
  {
    id: 'foundation-robotics-3m',
    title: 'Foundation Maker Track - 3 Months',
    description: 'Introduction to robotics and coding for young minds. Learn block programming, basic electronics, and build your first robot!',
    grade: 'Class 4-6',
    duration: '3 Months',
    sessions: 24,
    totalHours: 36,
    price: 15999,
    originalPrice: 24999,
    emiAvailable: true,
    emiAmount: 5333,
    emiMonths: 3,
    image: '/placeholder.svg',
    category: 'foundation',
    tags: ['Block Programming', 'Electronics', 'CBSE Aligned'],
    features: [
      'CBSE & NCF 2023 Aligned',
      'Hands-on Project Based Learning',
      'Robotics Kit Included',
      'Certificate on Completion',
      '24 Live Sessions',
      'Doubt Clearing Sessions'
    ],
    curriculum: [
      {
        id: 'fm-1',
        title: 'Introduction to Robotics',
        duration: '6 Hours',
        lessons: [
          { id: 'fm-1-1', title: 'What is a Robot?', duration: '45 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/81rczD64n9I' }, // What is Robotics?
          { id: 'fm-1-2', title: 'History of Robotics', duration: '30 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/z1d8t2_k4qU' }, // History of Robotics
          { id: 'fm-1-3', title: 'Types of Robots', duration: '45 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/u8DnbJp_M28' }, // Types of Robots
          { id: 'fm-1-4', title: 'Your First Robot Project', duration: '90 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/0H5g9Vs0ENM' } // DIY Robot
        ]
      },
      {
        id: 'fm-2',
        title: 'Basic Electronics',
        duration: '9 Hours',
        lessons: [
          { id: 'fm-2-1', title: 'Understanding Circuits', duration: '45 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/EJeAuQ7pkpc' },
          { id: 'fm-2-2', title: 'LEDs and Resistors', duration: '60 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/eX80I9pQ65E' },
          { id: 'fm-2-3', title: 'Motors and Sensors', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/0L1yQ6vXq5E' },
          { id: 'fm-2-4', title: 'Build a Traffic Light', duration: '120 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/5M4E80D60x0' }
        ]
      },
      {
        id: 'fm-3',
        title: 'Block Programming',
        duration: '12 Hours',
        lessons: [
          { id: 'fm-3-1', title: 'Introduction to Scratch', duration: '60 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/jX0hjwI0yGg' },
          { id: 'fm-3-2', title: 'Loops and Conditions', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/C28iW_j_g1I' },
          { id: 'fm-3-3', title: 'Programming Your Robot', duration: '120 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/6q2Hj0Q6G1M' },
          { id: 'fm-3-4', title: 'Final Project: Autonomous Robot', duration: '180 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/v55d_29k1xU' }
        ]
      }
    ],
    rating: 4.8,
    studentsEnrolled: 2450,
    instructor: 'Dr. Priya Sharma',
    level: 'Beginner'
  },
  {
    id: 'foundation-robotics-6m',
    title: 'Foundation Maker Track - 6 Months',
    description: 'Extended foundation program with deeper exploration of robotics, electronics, and programming concepts.',
    grade: 'Class 4-6',
    duration: '6 Months',
    sessions: 48,
    totalHours: 72,
    price: 29999,
    originalPrice: 45999,
    emiAvailable: true,
    emiAmount: 4999,
    emiMonths: 6,
    image: '/placeholder.svg',
    category: 'foundation',
    tags: ['Block Programming', 'Electronics', 'IoT Basics', 'CBSE Aligned'],
    features: [
      'CBSE & NCF 2023 Aligned',
      'Advanced Project Based Learning',
      'Premium Robotics Kit Included',
      'Certificate on Completion',
      '48 Live Sessions',
      'Weekly Doubt Clearing',
      'Parent Progress Reports'
    ],
    curriculum: [
      {
        id: 'fm-1',
        title: 'Introduction to Robotics',
        duration: '6 Hours',
        lessons: [
          { id: 'fm-1-1', title: 'What is a Robot?', duration: '45 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/81rczD64n9I' }, // What is Robotics?
          { id: 'fm-1-2', title: 'History of Robotics', duration: '30 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/z1d8t2_k4qU' }, // History of Robotics
          { id: 'fm-1-3', title: 'Types of Robots', duration: '45 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/u8DnbJp_M28' }, // Types of Robots
          { id: 'fm-1-4', title: 'Your First Robot Project', duration: '90 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/0H5g9Vs0ENM' } // DIY Robot
        ]
      }
    ],
    rating: 4.9,
    studentsEnrolled: 1820,
    instructor: 'Dr. Priya Sharma',
    level: 'Beginner'
  },
  {
    id: 'intermediate-robotics-3m',
    title: 'Intermediate Robotics Track - 3 Months',
    description: 'Take your robotics skills to the next level with Python programming, advanced sensors, and IoT projects.',
    grade: 'Class 7-10',
    duration: '3 Months',
    sessions: 24,
    totalHours: 36,
    price: 19999,
    originalPrice: 32999,
    emiAvailable: true,
    emiAmount: 6666,
    emiMonths: 3,
    image: '/placeholder.svg',
    category: 'intermediate',
    tags: ['Python', 'C++', 'IoT', 'Sensors', 'CBSE Aligned'],
    features: [
      'CBSE AI (Code 417) Aligned',
      'Python & C++ Programming',
      'Advanced Sensor Integration',
      'IoT Project Development',
      'Competition Preparation',
      'Industry Mentorship'
    ],
    curriculum: [
      {
        id: 'im-1',
        title: 'Python for Robotics',
        duration: '12 Hours',
        lessons: [
          { id: 'im-1-1', title: 'Python Fundamentals', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw' },
          { id: 'im-1-2', title: 'Control Structures', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/PKIbzNuy1bU' },
          { id: 'im-1-3', title: 'Functions and Modules', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/o9pEzgHorH0' },
          { id: 'im-1-4', title: 'Python with Arduino', duration: '120 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/V1TxN7tNNeY' }
        ]
      },
      {
        id: 'im-2',
        title: 'Advanced Sensors',
        duration: '12 Hours',
        lessons: [
          { id: 'im-2-1', title: 'Ultrasonic Sensors', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/ZejQOX69K5M' },
          { id: 'im-2-2', title: 'IR and Line Sensors', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/5I5j2z3d8r4' },
          { id: 'im-2-3', title: 'Temperature & Humidity', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/c1v8t1v8X8g' },
          { id: 'im-2-4', title: 'Obstacle Avoidance Robot', duration: '180 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/5I5j2z3d8r4' }
        ]
      }
    ],
    rating: 4.7,
    studentsEnrolled: 1650,
    instructor: 'Prof. Rajesh Kumar',
    level: 'Intermediate'
  },
  {
    id: 'intermediate-robotics-6m',
    title: 'Intermediate Robotics Track - 6 Months',
    description: 'Comprehensive intermediate program covering advanced robotics, AI basics, and competition preparation.',
    grade: 'Class 7-10',
    duration: '6 Months',
    sessions: 48,
    totalHours: 72,
    price: 37999,
    originalPrice: 55999,
    emiAvailable: true,
    emiAmount: 6333,
    emiMonths: 6,
    image: '/placeholder.svg',
    category: 'intermediate',
    tags: ['Python', 'C++', 'AI Basics', 'IoT', 'Competition'],
    features: [
      'CBSE AI (Code 417) Aligned',
      'Advanced Programming Skills',
      'AI & ML Introduction',
      'National Competition Prep',
      'Industry Projects',
      'Career Guidance'
    ],
    curriculum: [],
    rating: 4.8,
    studentsEnrolled: 1280,
    instructor: 'Prof. Rajesh Kumar',
    level: 'Intermediate'
  },
  {
    id: 'advanced-robotics-3m',
    title: 'Advanced Pre-Engineering Track - 3 Months',
    description: 'Industry-level robotics training with ROS, Computer Vision, and industrial automation concepts.',
    grade: 'Class 11-12',
    duration: '3 Months',
    sessions: 24,
    totalHours: 36,
    price: 24999,
    originalPrice: 39999,
    emiAvailable: true,
    emiAmount: 8333,
    emiMonths: 3,
    image: '/placeholder.svg',
    category: 'advanced',
    tags: ['ROS', 'Computer Vision', 'AI/ML', 'Industrial Automation'],
    features: [
      'CBSE Electronics (Code 420) Aligned',
      'ROS Framework Training',
      'Computer Vision with OpenCV',
      'Industry Internship Opportunity',
      'College Application Support',
      'Research Project Guidance'
    ],
    curriculum: [
      {
        id: 'ad-1',
        title: 'ROS Fundamentals',
        duration: '12 Hours',
        lessons: [
          { id: 'ad-1-1', title: 'Introduction to ROS', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/930c8R1r3a8' },
          { id: 'ad-1-2', title: 'ROS Nodes and Topics', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/0G6yT0A3u5U' },
          { id: 'ad-1-3', title: 'ROS Services', duration: '90 min', type: 'video', videoUrl: 'https://www.youtube.com/embed/0G6yT0A3u5U' },
          { id: 'ad-1-4', title: 'Building a ROS Robot', duration: '180 min', type: 'project', videoUrl: 'https://www.youtube.com/embed/0G6yT0A3u5U' }
        ]
      }
    ],
    rating: 4.9,
    studentsEnrolled: 890,
    instructor: 'Dr. Anil Mehta',
    level: 'Advanced'
  },
  {
    id: 'advanced-robotics-9m',
    title: 'Advanced Pre-Engineering Track - 9 Months',
    description: 'Complete pre-engineering program preparing students for top engineering colleges and robotics careers.',
    grade: 'Class 11-12',
    duration: '9 Months',
    sessions: 72,
    totalHours: 108,
    price: 59999,
    originalPrice: 89999,
    emiAvailable: true,
    emiAmount: 6666,
    emiMonths: 9,
    image: '/placeholder.svg',
    category: 'advanced',
    tags: ['ROS', 'Computer Vision', 'Deep Learning', 'Research'],
    features: [
      'Complete Pre-Engineering Curriculum',
      'Industry Certification',
      'Guaranteed Internship',
      'Research Paper Publication Support',
      'College Recommendation Letters',
      'Lifetime Alumni Network Access'
    ],
    curriculum: [],
    rating: 4.9,
    studentsEnrolled: 450,
    instructor: 'Dr. Anil Mehta',
    level: 'Advanced'
  }
];

export const courseCategories = [
  { id: 'foundation', name: 'Foundation Maker', grades: 'Class 4-6', color: 'primary' },
  { id: 'intermediate', name: 'Intermediate Robotics', grades: 'Class 7-10', color: 'secondary' },
  { id: 'advanced', name: 'Advanced Pre-Engineering', grades: 'Class 11-12', color: 'accent' }
];
