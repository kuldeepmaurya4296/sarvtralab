import { Metadata } from 'next';

export const SITE_CONFIG = {
    name: 'Sarvtra Labs',
    url: 'https://sarvtralabs.com', // Replace with actual production URL
    description: 'An innovative education platform connecting students, schools, and government. Explore robotics, AI, and modern technologies with Sarvtra Labs.',
    keywords: [
        // Brand & Variations
        'Sarvtra', 'Sarvatra', 'Sarvetra', 'Sarvtra Labs', 'Sarwatra Labs', 'Sarvatra Labs', 'Sarvatralabs', 'Sarvtra Lbas', 'Sarvtra Education', 'Sarvtra Robotics', 'Sarvtra Coding',

        // Location-specific (Bhopal & MP focus)
        'Robotics in Bhopal', 'Robotic classes Bhopal', 'Robotic labs in Bhopal', 'Best robotics training in Bhopal', 'Robotics workshop Bhopal', 'STEM education Bhopal',
        'Robotics coaching Bhopal', 'Robotics school Bhopal', 'Coding classes for kids in Bhopal', 'Python classes in Bhopal', 'Arduino training Bhopal', 'Raspberry Pi Bhopal',
        'Robotics near Bhopal', 'Robotic classes Mandideep', 'Robotics classes Sehore', 'Robotics classes Vidisha', 'Robotics classes Hoshangabad', 'Robotics classes Raisen',
        'Robotics education Madhya Pradesh', 'MP robotics hub', 'Indore robotics classes', 'Gwalior robotics training', 'Jabalpur robotics workshop',

        // General Robotics & STEM
        'Robotics for kids', 'Online robotics classes', 'Robotics for students', 'Best robotics courses', 'STEM Learning India', 'Robotics kits for kids',
        'Humanoid robotics for students', 'LEGO robotics India', 'VEX robotics training', 'Drones for kids', 'DIY robotics projects', 'Robotics for beginners',
        'Advanced robotics for high school', 'Robotics for Class 4', 'Robotics for Class 5', 'Robotics for Class 6', 'Robotics for Class 7', 'Robotics for Class 8',
        'Robotics for Class 9', 'Robotics for Class 10', 'Robotics for Class 11', 'Robotics for Class 12',

        // Coding & AI
        'Coding for kids online', 'AI for students', 'Artificial Intelligence for kids', 'Machine Learning for students', 'Python programming for kids',
        'Scratch coding for beginners', 'Block based coding', 'C++ for robotics', 'App development for students', 'Web development for kids',
        'Game development for students', 'Future skills for kids', 'Digital literacy students India',

        // Curriculum & Boards
        'CBSE Robotics Curriculum', 'NCF 2023 robotics', 'NEP 2020 robotics coding', 'Skill education CBSE', 'Robotics in Indian schools',
        'ICSE robotics classes', 'IB robotics program', 'State board robotics', 'School robotics lab setup', 'ATL lab training', 'Atal Tinkering Lab Bhopal',

        // Competitions
        'Robotics competitions for kids', 'WRO India training', 'World Robot Olympiad preparation', 'FLL India coaching', 'First Lego League Bhopal',
        'National robotics championship', 'Inter-school robotics competition',

        // Common Misspellings (User requested)
        'sarvetra', 'servatralabs', 'sarvtra lbas', 'robototic classes', 'robototic', 'online rorbotic claesess', 'rbotic', 'codding for kids',
        'stem eduction', 'robtics', 'robotic labs near me', 'robotic classes near me', 'online robotic classes', 'coding clases', 'robotic classes near bhopal',

        // Service Related
        'Free trial robotics class', 'Robotics summer camp 2026', 'Winter robotics workshop', 'Weekend robotics classes', 'After school robotics program',
        'One-on-one robotics mentoring', 'Group robotics classes', 'Corporate social responsibility robotics', 'CSR robotics education',

        // Broad Category Keywords (Expanding to reach ~500 concepts)
        'Educational robotics kit', 'Microcontroller for kids', 'Sensors training for students', 'Electronics for beginners', 'Mechatronics for school students',
        'Internet of Things for kids', 'IoT student projects', '3D printing for schools', 'CAD for students', 'Design thinking workshops',
        'Innovation hub for kids', 'Young scientists program India', 'Technology lab for schools', 'Future engineers training', 'Space science for kids',
        'Astronomy and robotics', 'Rocketry for students', 'Renewable energy projects kids', 'Smart city projects for students',
        'Virtual reality for education', 'Augmented reality coding', 'Robotic surgery concepts for kids', 'Industrial robotics exposure',
        'Robotics career guidance', 'Engineering foundation for school', 'IIT foundation robotics', 'NIT alumni robotics startup',
        'Sarvtra LMS', 'Sarvtra student portal', 'Sarvtra teacher training', 'Robotics certification India', 'Government school robotics program',
        'Private school robotics partner', 'School robotics franchising', 'Home schooling robotics kits', 'Robotics toy for 10 year old',
        'Best birthday gift for creative kids', 'Robotic arm project', 'Walking robot kit', 'Voice controlled robot', 'Obstacle avoiding robot',
        'Line follower robot tutorial', 'Mobile controlled robot', 'Bluetooth robotics project', 'WiFi robotics for kids', 'App controlled car kit'
    ],
    author: 'Sarvtra Labs',
    ogImage: '/og-image.jpg', // Make sure this exists
};

export const SEO_KEYWORDS = [
    // Brand & Variations
    'Sarvtra', 'Sarvatra', 'Sarvetra', 'Sarvtra Labs', 'Sarwatra Labs', 'Sarvatra Labs', 'Sarvatralabs', 'Sarvtra Lbas', 'Sarvtra Education', 'Sarvtra Robotics', 'Sarvtra Coding',

    // Original User Requests
    'sarvetra', 'servatralabs', 'sarvtra lbas', 'sarvatra in bhopal', 'robotic labs near bhopal', 'robotic classes near me', 'robototic classes for online', 'online rorbotic claesess',

    // Location-specific (Bhopal & MP focus)
    'Robotics in Bhopal', 'Robotic classes Bhopal', 'Robotic labs in Bhopal', 'Best robotics training in Bhopal', 'Robotics workshop Bhopal', 'STEM education Bhopal',
    'Robotics coaching Bhopal', 'Robotics school Bhopal', 'Coding classes for kids in Bhopal', 'Python classes in Bhopal', 'Arduino training Bhopal', 'Raspberry Pi Bhopal',
    'Robotics near Bhopal', 'Robotic classes Mandideep', 'Robotics classes Sehore', 'Robotics classes Vidisha', 'Robotics classes Hoshangabad', 'Robotics classes Raisen',
    'Robotics education Madhya Pradesh', 'MP robotics hub', 'Indore robotics classes', 'Gwalior robotics training', 'Jabalpur robotics workshop', 'Bhopal education startup',
    'Best STEM labs Bhopal', 'Robotics classes near Arera Colony', 'Robotics training MP Nagar', 'Coding for kids Gulmohar Bhopal',

    // General Robotics & STEM
    'Robotics for kids', 'Online robotics classes', 'Robotics for students', 'Best robotics courses', 'STEM Learning India', 'Robotics kits for kids',
    'Humanoid robotics for students', 'LEGO robotics India', 'VEX robotics training', 'Drones for kids', 'DIY robotics projects', 'Robotics for beginners',
    'Advanced robotics for high school', 'Robotics for Class 4', 'Robotics for Class 5', 'Robotics for Class 6', 'Robotics for Class 7', 'Robotics for Class 8',
    'Robotics for Class 9', 'Robotics for Class 10', 'Robotics for Class 11', 'Robotics for Class 12',
    'After school STEM', 'Educational robotics', 'Competitive robotics training', 'Robotics certification for students',

    // Coding & AI
    'Coding for kids online', 'AI for students', 'Artificial Intelligence for kids', 'Machine Learning for students', 'Python programming for kids',
    'Scratch coding for beginners', 'Block based coding', 'C++ for robotics', 'App development for students', 'Web development for kids',
    'Game development for students', 'Future skills for kids', 'Digital literacy students India', 'Coding bootcamp for kids', 'Online coding tutor India',

    // Curriculum & Boards
    'CBSE Robotics Curriculum', 'NCF 2023 robotics', 'NEP 2020 robotics coding', 'Skill education CBSE', 'Robotics in Indian schools',
    'ICSE robotics classes', 'IB robotics program', 'State board robotics', 'School robotics lab setup', 'ATL lab training', 'Atal Tinkering Lab Bhopal',
    'Robotics teacher training', 'STEM curriculum partner', 'Integrated robotics labs',

    // Competitions
    'Robotics competitions for kids', 'WRO India training', 'World Robot Olympiad preparation', 'FLL India coaching', 'First Lego League Bhopal',
    'National robotics championship', 'Inter-school robotics competition', 'Robofest India preparation', 'Technoxian training',

    // Misspellings (SEO reach)
    'sarvetra', 'servatralabs', 'sarvtra lbas', 'robototic classes', 'robototic', 'online rorbotic claesess', 'rbotic', 'codding for kids',
    'stem eduction', 'robtics', 'robotic labs near me', 'robotic classes near me', 'online robotic classes', 'coding clases', 'robotic classes near bhopal',
    'robotic training near me', 'robotic center near me', 'robotics institute near me',

    // Expansion (Meeting the ~500 target)
    'Robotics kits Bhopal', 'Arduino projects for kids', 'Raspberry Pi projects India', 'Internet Of Things student projects',
    'IoT for kids Bhopal', 'Drone building workshop India', 'Smart agriculture student projects', 'Solar powered robot kit',
    'Walking robot for kids', 'Voice controlled robot car', 'Obstacle avoiding robot project', 'Line follower robot Bhopal',
    'Bluetooth controlled robot training', 'App controlled robotics India', 'Home automation for kids', 'Electronics basics students',
    'Soldering workshop for kids', '3D printing workshop Bhopal', 'CAD design for school students', 'Laser cutting for kids',
    'Innovation lab schools Bhopal', 'Technology curriculum for schools', 'Digital transformation in education', 'Future of EdTech India',
    'Robot designing for Class 9', 'Robotic sensors for students', 'Microcontroller basics for kids', 'Circuit design for beginners',
    'Mechanical engineering for kids', 'Electrical engineering for school', 'Computer science for Class 8', 'Data science for kids',
    'Cyber security for students', 'Block chain for kids India', 'Cloud computing for schools', 'Virtual reality education Bhopal',
    'Augmented reality workshops MP', 'Mechatronics foundation course', 'Automation for kids', 'Industrial robotics exposure students',
    'Robotics lab equipment suppliers India', 'School robotics lab furniture', 'Academic robotics partner', 'STEM outreach programs',
    'Rural education robotics India', 'Affordable robotics classes', 'Quality STEM education Bhopal', 'Interactive learning robotics',
    'Gamified coding classes kids', 'Robotics for non-technical kids', 'Creativity and technology workshops', 'Design thinking for students',
    'Problem solving skills through robotics', 'Critical thinking STEM classes', 'Team building robotics workshops', 'Leadership through tech projects',
    'Sarvtra student community', 'Sarvtra alumni network', 'Winning robotics teams Bhopal', 'National Science Day robotics',
    'Engineers Day robots Bhopal', 'Kids robotics party Bhopal', 'Birthday robotics workshop', 'Individual robotics kits online',
    'Bulk robotics kits for schools', 'Institutional robotics training', 'Government tenders school robotics', 'Smart class robotics integration',
    'Remote robotics lab access', 'Cloud based robotics simulations', 'Tinkercard training for kids', 'Wokwi simulation classes',
    'Mobile app for robotics learning', 'LMS for school robotics', 'Progress tracking EdTech platform', 'Parent teacher robotics meeting',
    'Robotics exhibition for schools', 'Science fair robot ideas', 'Working models of robots classification', 'Types of robots for kids',
    'Industrial grade robotics parts for students', 'Servo motors training', 'Dc motors for kids projects', 'Battery technology for robotics',
    'Renewable energy robots students', 'Bio-inspired robotics for kids', 'Underwater robotics workshop', 'Space robotics for students',
    'Satellite building for kids', 'Radio controlled robots training', 'Wireless communication for robotics', 'PCB design for students',
    'Embedded systems for kids', 'Hardware prototyping workshops', 'Product design for students', 'Entrepreneurship for kids India',
    'Pitching tech ideas for students', 'Young innovators of Bhopal', 'Sarvtra success stories', 'Sarvatra student achievements',
    'Robotics coaching near me', 'STEM classes in Indore', 'Coding center in Gwalior', 'Indore robotics lab', 'Jabalpur STEM hub',
    'Madhya Pradesh robotics mission', 'Digital India robotics and coding', 'Skill India robotics training', 'Make in India robotics kits',
    'Robotic toys made in India', 'Indian robotics startup', 'EdTech Bhopal', 'Education technology Madhya Pradesh',
    'Best robotics classes in central India', 'Premier robotics institute Bhopal', 'Center of excellence robotics schools',
    'Robotic science for Class 5', 'Elementary robotics Bhopal', 'Middle school robotics MP', 'High school robotics training',
    'Robotics career counseling', 'Internship in robotics for students', 'Volunteering in robotics education', 'Sarvtra jobs',
    'Teaching robotics in Bhopal', 'Robotics educator training', 'STEM trainer Bhopal', 'Coding teacher vacancy Bhopal',
    'Part time robotics trainer', 'Full time robotics faculty', 'Guest lectures in robotics', 'Expert talk on AI and robotics',
    'Upcoming robotics events 2026', 'Robotics news India', 'Latest trends in school robotics', 'Educational technology 2026',
    'Next gen education Bhopal', 'Holistic development through robotics', 'Logical thinking through coding', 'Math and robotics connection',
    'Physics through robotics kits', 'School science lab up-gradation', 'Modernizing education in MP', 'Bhopal tech community',
    'Code for Bhopal', 'Roboticists of Madhya Pradesh', 'Central India robotics meetup', 'Parents guide to robotics',
    'How to teach robotics at home', 'DIY robotics guide 2026', 'Best coding apps for kids', 'Top 10 robotics kits for students',
    'Compare robotics classes Bhopal', 'Affordable coding for kids', 'Scholarships for robotics students', 'Female students in robotics India',
    'Girls in STEM Bhopal', 'Empowering girls through technology', 'Diversity in robotics Bhopal', 'Inclusive STEM education',
    'Special education robotics programs', 'Accessible robotics for all kids', 'Sarvtra impact report', 'Robotics for social good',
    'Environmental sensing robots', 'Climate change projects for kids', 'Waste management robots students', 'Plastic sorting robot kits',
    'Water saving robotics India', 'Smart home projects students', 'Safety robots for kids', 'Med-tech for students',
    'Sarvtra support', 'Contact Sarvtra Labs', 'Sarvtra location', 'Sarvtra office Bhopal', 'Sarvtra help desk',
    'FAQ robotics classes', 'How to join Sarvtra Labs', 'Franchise opportunity robotics', 'Partner with Sarvtra', 'School collaboration STEM',
    'Robotics lab for Class 1 to 12', 'Comprehensive robotics curriculum', 'Standards for robotics education', 'Robotics safety for kids',
    'Battery safety robotics kits', 'Online safe coding for students', 'Screen time management and coding', 'Physical computing for kids',
    'Balance of virtual and physical learning', 'Hybrid robotics model students', 'Sarvtra mobile app', 'Student dashboard robotics',
    'Admin portal School robotics', 'Teacher dashboard tracking', 'Analytics for robotics progress', 'School performance in robotics',
    'District level robotics ranking', 'State level STEM excellence', 'National ranking for robotics schools', 'Sarvtra Awards',
    'Best robotics student of the year', 'Innovative school award Bhopal', 'Top STEM educator MP', 'Sarvtra leaderboard',
    'Weekly robotics challenges', 'Monthly coding hackathon kids', 'Annual robotics fest Sarvtra', 'Virtual robotics competition',
    'Augmented reality robotics training', 'Mixed reality in STEM', 'Holographic robots education', 'AI chatbots for student support',
    'Personalized learning path robotics', 'Adaptive learning EdTech India', 'Competency based education robotics',
    'Skill based grading in robotics', 'Digital portfolio for students', 'Robotics CV for college applications', 'Study abroad robotics guidance',
    'US university robotics prep', 'German robotics education exposure', 'Japanese robotics technology for kids', 'Global STEM standards Sarvtra',
    'Multilingual robotics support', 'Robotics in Hindi', 'Coding instructions in regional languages', 'Sarvtra reaches every student',
    'Universal access to robotics India', 'Mission 1 million students trained', 'Sarvtra 2030 vision', 'Transforming education Bhopal',
    'Heart of India robotics', 'Bhopal startup ecosystem robotics', 'Tech-driven Bhopal', 'Smart city Bhopal robotics integration',
    'Vocal for local robotics kits', 'Swadeshi robotics education', 'Bharat robotics and coding', 'New India STEM',
    'Amrit Kaal robotics mission', 'Viksit Bharat students robotics', 'Innovation for Bharat', 'Sarvtra Labs - Leading the change',

    // Additional Expansion for ~500+
    'Robotics Classes Koh-e-Fiza', 'Robotics Classes Indrapuri Bhopal', 'Robotics Classes Ayodhya Bypass', 'Robotics Classes Bawadiya Kalan',
    'Robotics Classes Katara Hills', 'Robotics Classes Kolar Road', 'Robotics Classes Lalghati', 'Robotics Classes Bairagarh',
    'Coding center in Misrod', 'Stem training Hoshangabad Road', 'Robotics workshop for school teachers', 'School principal guide to robotics',
    'Educational hardware India', 'Robotics curriculum alignment NCF', 'Bloom Taxonomy in robotics', 'Experimental learning Bhopal',
    'Constructivism in robotics education', 'Kinesthetic learning robotics', 'Robotics for ADHD students', 'Robotics for gifted children',
    'Low cost robotics kits', 'Open source robotics education', 'Python for Class 11 CS', 'IP curriculum CBSE coding',
    'Artificial Intelligence Class 9 CBSE', 'Robotics Level 1 certification', 'Advanced Robotics Level 3', 'Mastering Arduino for students',
    'Raspberry Pi Pico projects kids', 'ESP32 for school projects', 'IoT weather station school', 'Smart irrigation robot student',
    'Solar tracker project for students', 'Gesture controlled robot kit', 'Mind controlled robots concept', 'Brain computer interface for kids',
    'Future of robotics in India 2030', 'EdTech trends in Madhya Pradesh', 'Bhopal robotics community member', 'Sarvtra Labs reviews',
    'Is Sarvtra Labs good for kids', 'Best robotics kit for 12 year old boy', 'Best coding gift for 8 year old girl',
    'Technology birthday themes Bhopal', 'Robotics for summer holidays', 'Winter break coding classes', 'Online STEM mentor India'
];

export function constructMetadata({
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    image = SITE_CONFIG.ogImage,
    icons = {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
        other: [
            {
                rel: 'manifest',
                url: '/site.webmanifest',
            },
        ],
    },
    noIndex = false,
    canonical,
    keywords = SEO_KEYWORDS,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: any;
    noIndex?: boolean;
    canonical?: string;
    keywords?: string[];
} = {}): Metadata {
    return {
        title: {
            default: title,
            template: `%s | ${SITE_CONFIG.name}`,
        },
        description,
        keywords: keywords.slice(0, 50).join(', '),
        authors: [{ name: SITE_CONFIG.author }],
        creator: SITE_CONFIG.author,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: SITE_CONFIG.url,
            title,
            description,
            siteName: SITE_CONFIG.name,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@sarvtralabs',
        },
        icons,
        metadataBase: new URL(SITE_CONFIG.url),
        ...(canonical && { alternates: { canonical } }),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
