
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarvtra_labs:kdbruWx8V7FVe88q@cluster0.hqcptct.mongodb.net/?appName=Cluster0';

const PlanSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    type: { type: String, enum: ['school', 'individual'], default: 'school' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
    timestamps: true
});

const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);

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
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const planData of initialPlans) {
            const existing = await Plan.findOne({ id: planData.id });
            if (existing) {
                console.log(`ℹ️ Plan ${planData.name} already exists, updating features...`);
                await Plan.updateOne({ id: planData.id }, planData);
            } else {
                await Plan.create(planData);
                console.log(`✅ Created plan: ${planData.name}`);
            }
        }

        console.log('✅ Plan Seeding Completed!');
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedPlans();
