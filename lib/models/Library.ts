
import mongoose, { Schema, Model } from 'mongoose';

const LibraryFolderSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    parentId: String,
    path: String
}, {
    timestamps: true
});

const LibraryContentSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    type: { type: String, enum: ['Video', 'PDF', 'Image', 'Doc', 'Other'] },
    url: String,
    fileUrl: String,
    folderId: String,
    size: String,
    status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
    courseIds: [String],
    description: String,
    lastModified: String
}, {
    timestamps: true
});

export const LibraryFolder: Model<any> = mongoose.models.LibraryFolder || mongoose.model('LibraryFolder', LibraryFolderSchema);
export const LibraryContent: Model<any> = mongoose.models.LibraryContent || mongoose.model('LibraryContent', LibraryContentSchema);
