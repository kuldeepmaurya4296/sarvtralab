
import mongoose, { Schema, Model } from 'mongoose';

const UserSchema = new Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'school', 'govt', 'superadmin', 'teacher', 'helpsupport'], index: true },
    name: { type: String, required: true },
    avatar: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },

    // Student fields
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    schoolName: {
        type: String,
        required: function () {
            // @ts-ignore
            return this.role === 'student' || this.role === 'school';
        }
    },
    grade: String,
    parentName: String,
    parentPhone: String,
    parentEmail: String,
    dateOfBirth: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    enrolledCourses: [String],
    completedCourses: [String],

    // School fields
    schoolCode: String,
    principalName: String,
    schoolType: String,
    board: String,
    totalStudents: Number,
    phone: String,
    websiteUrl: String,

    // Govt fields
    organizationType: String,
    organizationName: String,
    designation: String,
    department: String,
    jurisdiction: String,
    district: String,

    // Teacher & School & Govt fields shared
    assignedSchools: [String],
    assignedCourses: [String],
    status: { type: String, default: 'active' },

    // Teacher fields
    specialization: String,
    qualifications: String,
    experience: Number,

    // Helper fields
    assignedStudents: [String],
    ticketsResolved: Number,
    ticketsPending: Number,

    // SuperAdmin fields
    permissions: [String],
    lastLogin: String,

    // Subscription
    subscriptionPlan: String,
    subscriptionExpiry: String
}, {
    timestamps: true
});

const User: Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
