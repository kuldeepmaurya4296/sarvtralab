export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  category: string;
  videoUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const showcaseVideos: Video[] = [
  {
    id: 'vid-001',
    title: 'Introduction to Robotics for Kids',
    description: 'Learn the basics of robotics in this fun and interactive session.',
    thumbnail: '/placeholder.svg',
    duration: '5:32',
    views: 125000,
    category: 'Foundation',
    videoUrl: 'https://www.youtube.com/embed/81rczD64n9I'
  },
  {
    id: 'vid-002',
    title: 'Building Your First Robot',
    description: 'Step-by-step guide to building a line following robot.',
    thumbnail: '/placeholder.svg',
    duration: '8:15',
    views: 98000,
    category: 'Foundation',
    videoUrl: 'https://www.youtube.com/embed/0H5g9Vs0ENM'
  },
  {
    id: 'vid-003',
    title: 'Python Programming for Robotics',
    description: 'Master Python programming for controlling robots.',
    thumbnail: '/placeholder.svg',
    duration: '12:45',
    views: 75000,
    category: 'Intermediate',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
  },
  {
    id: 'vid-004',
    title: 'AI in Robotics - Future is Here',
    description: 'Explore how AI is transforming the world of robotics.',
    thumbnail: '/placeholder.svg',
    duration: '15:20',
    views: 156000,
    category: 'Advanced',
    videoUrl: 'https://www.youtube.com/embed/ad79nYk2keg'
  },
  {
    id: 'vid-005',
    title: 'Student Success Stories',
    description: 'Watch how our students are winning national robotics competitions.',
    thumbnail: '/placeholder.svg',
    duration: '6:48',
    views: 245000,
    category: 'Testimonial',
    videoUrl: 'https://www.youtube.com/embed/Fe8wpM-As1o'
  },
  {
    id: 'vid-006',
    title: 'CBSE Robotics Lab Setup Guide',
    description: 'Complete guide for schools to set up their robotics lab.',
    thumbnail: '/placeholder.svg',
    duration: '18:30',
    views: 45000,
    category: 'School',
    videoUrl: 'https://www.youtube.com/embed/JmC-qT5f6kQ'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Priya Sharma',
    role: 'Student, Class 8',
    school: 'Delhi Public School, Noida',
    content: 'Sarvtra Labs made robotics so fun and easy to understand! I won 2nd place in the state robotics competition after completing the intermediate course.',
    rating: 5,
    avatar: '/placeholder.svg'
  },
  {
    id: 'test-002',
    name: 'Dr. Meera Gupta',
    role: 'Principal',
    school: 'Delhi Public School, Noida',
    content: 'Implementing Sarvtra Labs in our school has transformed how students approach STEM education. The curriculum perfectly aligns with CBSE requirements.',
    rating: 5,
    avatar: '/placeholder.svg'
  },
  {
    id: 'test-003',
    name: 'Rajesh Patel',
    role: 'Parent',
    school: 'Ryan International School',
    content: 'My son Arjun has developed such a passion for coding and robotics. The progress reports help us stay connected with his learning journey.',
    rating: 5,
    avatar: '/placeholder.svg'
  },
  {
    id: 'test-004',
    name: 'Prof. Vikram Singh',
    role: 'HOD - Computer Science',
    school: 'Kendriya Vidyalaya, Delhi',
    content: 'The teacher training provided by Sarvtra Labs equipped our faculty with the skills to deliver world-class robotics education.',
    rating: 4,
    avatar: '/placeholder.svg'
  }
];

export const features: Feature[] = [
  {
    id: 'feat-001',
    title: 'CBSE Aligned Curriculum',
    description: 'Our courses are designed in accordance with NCF 2023, NEP 2020, and CBSE Skill Education Framework.',
    icon: 'GraduationCap'
  },
  {
    id: 'feat-002',
    title: 'Hands-on Learning',
    description: 'Project-based learning with real robotics kits delivered to your doorstep.',
    icon: 'Wrench'
  },
  {
    id: 'feat-003',
    title: 'Expert Instructors',
    description: 'Learn from IIT/NIT alumni and industry professionals with years of experience.',
    icon: 'Users'
  },
  {
    id: 'feat-004',
    title: 'Competition Ready',
    description: 'Prepare for national and international robotics competitions like ATL, WRO, and more.',
    icon: 'Trophy'
  },
  {
    id: 'feat-005',
    title: 'Progress Tracking',
    description: 'Real-time progress reports for students, parents, and schools.',
    icon: 'BarChart3'
  },
  {
    id: 'feat-006',
    title: 'Certification',
    description: 'Industry-recognized certificates on course completion.',
    icon: 'Award'
  }
];

export const faqs: FAQ[] = [
  {
    id: 'faq-001',
    question: 'What age group is suitable for these courses?',
    answer: 'Our courses are designed for students from Class 4 to Class 12. We have three tracks: Foundation (Class 4-6), Intermediate (Class 7-10), and Advanced (Class 11-12).'
  },
  {
    id: 'faq-002',
    question: 'Do students need any prior experience in coding or robotics?',
    answer: 'No prior experience is required for the Foundation track. We start from basics and gradually progress to advanced concepts.'
  },
  {
    id: 'faq-003',
    question: 'What is included in the course fee?',
    answer: 'The course fee includes live sessions, recorded videos, robotics kit, practice exercises, project materials, assessments, and certification.'
  },
  {
    id: 'faq-004',
    question: 'How does the EMI option work?',
    answer: 'We offer 0% interest EMI options through various payment partners. You can split your course fee into 3, 6, or 9 monthly installments with no additional cost.'
  },
  {
    id: 'faq-005',
    question: 'Can schools enroll their students in bulk?',
    answer: 'Yes! We offer special institutional packages for schools. Contact our school partnership team for customized solutions and pricing.'
  },
  {
    id: 'faq-006',
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 7-day money-back guarantee. If you are not satisfied with the course, you can request a full refund within 7 days of enrollment.'
  }
];

export const stats = [
  { label: 'Students Trained', value: '15,000+', icon: 'Users' },
  { label: 'Partner Schools', value: '120+', icon: 'School' },
  { label: 'States Covered', value: '18', icon: 'MapPin' },
  { label: 'Competition Winners', value: '250+', icon: 'Trophy' }
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'For Schools', href: '/schools' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export const footerLinks = {
  courses: [
    { label: 'Foundation Track (4-6)', href: '/courses?category=foundation' },
    { label: 'Intermediate Track (7-10)', href: '/courses?category=intermediate' },
    { label: 'Advanced Track (11-12)', href: '/courses?category=advanced' },
    { label: 'School Programs', href: '/schools' }
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press Kit', href: '/press' }
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/#faqs' },
    { label: 'Privacy Policy', href: '/privacy' }
  ],
  dashboards: [
    { label: 'Student Dashboard', href: '/student/dashboard' },
    { label: 'School Dashboard', href: '/school/dashboard' },
    { label: 'Govt Portal', href: '/govt/dashboard' },
    { label: 'Super Admin', href: '/admin/dashboard' }
  ]
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Anil Mehta',
    role: 'Founder & CEO',
    bio: 'IIT Delhi alumnus with 15+ years in robotics education',
    image: '/placeholder.svg'
  },
  {
    id: 'tm-2',
    name: 'Priya Sharma',
    role: 'Chief Academic Officer',
    bio: 'Former CBSE curriculum designer and education researcher',
    image: '/placeholder.svg'
  },
  {
    id: 'tm-3',
    name: 'Rajesh Kumar',
    role: 'Head of Technology',
    bio: 'Ex-Google engineer passionate about EdTech',
    image: '/placeholder.svg'
  },
  {
    id: 'tm-4',
    name: 'Dr. Meera Gupta',
    role: 'Director of Partnerships',
    bio: 'Education policy expert with government advisory experience',
    image: '/placeholder.svg'
  }
];

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Robotics Instructor',
    department: 'Education',
    location: 'Bangalore / Hybrid',
    type: 'Full-time',
    description: 'Lead our robotics curriculum delivery and mentor other instructors.'
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain our LMS platform using Next.js and MongoDB.'
  },
  {
    id: 'job-3',
    title: 'Curriculum Designer (STEM)',
    department: 'Content',
    location: 'Delhi NCR',
    type: 'Contract',
    description: 'Design engaging project-based learning modules for K-12 students.'
  }
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Future of Robotics in Schools',
    excerpt: 'Why every school needs a robotics lab by 2030 and how it impacts student learning.',
    date: 'Oct 15, 2025',
    author: 'Dr. Priya Sharma',
    image: '/blog-1.jpg',
    category: 'Education'
  },
  {
    id: 'blog-2',
    title: 'Understanding the NEP 2020 Guidelines for Coding',
    excerpt: 'A comprehensive guide to the new education policy and its emphasis on vocational skills.',
    date: 'Sep 28, 2025',
    author: 'Rajesh Kumar',
    image: '/blog-2.jpg',
    category: 'Policy'
  },
  {
    id: 'blog-3',
    title: '5 Fun Robotics Projects for Beginners',
    excerpt: 'Get started with these simple yet exciting projects using basic electronics.',
    date: 'Sep 10, 2025',
    author: 'Vikram Singh',
    image: '/blog-3.jpg',
    category: 'Tutorial'
  }
];

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  source: string;
  link: string;
}

export const pressReleases: PressRelease[] = [
  {
    id: 'pr-1',
    title: 'Sarvtra Labs Partners with 50 Govt Schools in UP',
    date: 'Jan 10, 2026',
    source: 'Education Times',
    link: '#'
  },
  {
    id: 'pr-2',
    title: 'Sarvtra Labs Raises Series A Funding to Expand Reach',
    date: 'Nov 20, 2025',
    source: 'TechCrunch',
    link: '#'
  },
  {
    id: 'pr-3',
    title: 'Best EdTech Startup Award 2025 goes to Sarvtra Labs',
    date: 'Dec 05, 2025',
    source: 'Startup India',
    link: '#'
  }
];
