
import mongoose, { Schema, Model } from 'mongoose';

const LessonSchema = new Schema({
    id: String,
    title: String,
    duration: String,
    type: { type: String, enum: ['video', 'pdf', 'quiz', 'project'] },
    isCompleted: Boolean,
    videoUrl: String
});

const CurriculumModuleSchema = new Schema({
    id: String,
    title: String,
    duration: String,
    lessons: [LessonSchema]
});

const CourseSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    grade: String,
    duration: String,
    sessions: Number,
    totalHours: Number,
    price: Number,
    originalPrice: Number,
    emiAvailable: Boolean,
    emiAmount: Number,
    emiMonths: Number,
    image: String,
    category: { type: String, enum: ['foundation', 'intermediate', 'advanced'], index: true },
    tags: [String],
    features: [String],
    curriculum: [CurriculumModuleSchema],
    rating: Number,
    studentsEnrolled: { type: Number, default: 0 },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
}, {
    timestamps: true
});

const Course: Model<any> = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
