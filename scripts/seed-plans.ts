
import connectToDatabase from '../lib/mongoose';
import Plan from '../lib/models/Plan';

const initialPlans = [
    {
        id: 'pln-001',
        name: 'Basic',
        description: 'For small schools getting started',
        price: '₹49,999',
        period: '/year',
        features: [
            'Up to 50 students',
            '3 Course licenses',
            'Basic analytics dashboard',
            'Email support',
            'Teacher training (2 sessions)',
            'Standard robotics kits'
        ],
        popular: false,
        status: 'active',
        type: 'school'
    },
    {
        id: 'pln-002',
        name: 'Premium',
        description: 'Most popular for growing schools',
        price: '₹1,49,999',
        period: '/year',
        features: [
            'Up to 200 students',
            'All Course licenses',
            'Advanced analytics & reports',
            'Priority phone support',
            'Teacher training (6 sessions)',
            'Premium robotics kits',
            'Competition preparation',
            'Parent portal access'
        ],
        popular: true,
        status: 'active',
        type: 'school'
    },
    {
        id: 'pln-003',
        name: 'Enterprise',
        description: 'For large schools & chains',
        price: 'Custom',
        period: '',
        features: [
            'Unlimited students',
            'All Course licenses',
            'Custom curriculum integration',
            'Dedicated account manager',
            'Unlimited teacher training',
            'Custom robotics solutions',
            'White-label options',
            'API access'
        ],
        popular: false,
        status: 'active',
        type: 'school'
    }
];

async function seedPlans() {
    console.log('🌱 Starting Plan Seeding...');
    await connectToDatabase();

    for (const planData of initialPlans) {
        const existing = await Plan.findOne({ id: planData.id });
        if (existing) {
            console.log(`ℹ️ Plan ${planData.name} already exists, skipping...`);
        } else {
            await Plan.create(planData);
            console.log(`✅ Created plan: ${planData.name}`);
        }
    }

    console.log('✅ Plan Seeding Completed!');
    process.exit(0);
}

seedPlans().catch(err => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
