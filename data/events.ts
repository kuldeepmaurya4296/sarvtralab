
export interface Event {
    id: string;
    title: string;
    type: 'webinar' | 'workshop' | 'competition' | 'meetup';
    date: string;
    time: string;
    description: string;
    presenter?: string;
    image: string;
    location?: string; // or 'Virtual'
    registrationLink?: string;
    videoUrl?: string; // YouTube link if recorded
    isPast?: boolean;
}

export const events: Event[] = [
    // Upcoming
    {
        id: 'evt-2026-01',
        title: 'Introducing Advanced Robotics for Class 12',
        type: 'webinar',
        date: 'March 15, 2026',
        time: '4:00 PM IST',
        description: 'Join us for an exclusive look at our new curriculum designed for senior secondary students, featuring IoT and AI modules.',
        presenter: 'Dr. Anil Mehta',
        image: '/placeholder.svg',
        location: 'Virtual (Zoom)',
        registrationLink: '#',
        isPast: false
    },
    {
        id: 'evt-2026-02',
        title: 'National Robotics Championship 2026 - Boot Camp',
        type: 'workshop',
        date: 'April 05, 2026',
        time: '10:00 AM IST',
        description: 'A 2-day intensive workshop to prepare teams for the upcoming championship. Learn strategies, rules, and robot design tips.',
        presenter: 'Priya Sharma & Team',
        image: '/placeholder.svg',
        location: 'Sarvtra Lab HQ, Noida',
        registrationLink: '#',
        isPast: false
    },

    // Past (Recorded)
    {
        id: 'evt-2025-12',
        title: 'Understanding the New Education Policy (NEP) 2020',
        type: 'webinar',
        date: 'Dec 10, 2025',
        time: '5:00 PM IST',
        description: 'A deep dive into how NEP 2020 affects coding and vocational education in schools.',
        presenter: 'Dr. Meera Gupta',
        image: '/placeholder.svg',
        location: 'Virtual',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', // Replaced with Python Programming (Coding Education)
        isPast: true
    },
    {
        id: 'evt-2025-11',
        title: 'Parent Orientation: Why Robotics Matters',
        type: 'webinar',
        date: 'Nov 14, 2025',
        time: '6:00 PM IST',
        description: 'An interactive session for parents on the benefits of early STEM education.',
        presenter: 'Rajesh Kumar',
        image: '/placeholder.svg',
        location: 'Virtual',
        videoUrl: 'https://www.youtube.com/embed/81rczD64n9I', // Replaced with What is a Robot (Intro for Parents)
        isPast: true
    }
];
