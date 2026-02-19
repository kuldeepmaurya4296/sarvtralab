
import connectToDatabase from '@/lib/mongoose';
import { LibraryFolder, LibraryContent } from '@/lib/models/Library';

export interface LibraryFolderType {
    id: string;
    name: string;
    parentId: string | null;
    path: string;
    createdAt: string;
}

export interface LibraryContentType {
    id: string;
    title: string;
    type: 'Video' | 'PDF' | 'Image' | 'Doc' | 'Other';
    url?: string;
    fileUrl?: string;
    folderId: string;
    size: string;
    lastModified: string;
    status: 'Published' | 'Draft' | 'Archived';
    courseIds: string[];
    description?: string;
}

export const libraryService = {
    getContents: async (folderId: string = 'root') => {
        await connectToDatabase();

        const folder = await LibraryFolder.findOne({ id: folderId }).lean();
        const subfolders = await LibraryFolder.find({ parentId: folderId }).lean();
        const files = await LibraryContent.find({ folderId: folderId }).lean();

        // Get breadcrumbs
        const breadcrumbs = [];
        let current = folder;

        while (current) {
            breadcrumbs.unshift({ id: current.id, name: current.name });
            if (current.parentId) {
                current = await LibraryFolder.findOne({ id: current.parentId }).lean();
            } else {
                current = null;
            }
        }

        // Handle root which might not be in DB explicitely if not seeded, but usually 'root' is virtual or seeded.
        // If folderId is 'root' and not found in DB, we mock the root folder object for breadcrumbs
        if (folderId === 'root' && !folder && breadcrumbs.length === 0) {
            breadcrumbs.push({ id: 'root', name: 'Home' });
        }

        return {
            folder: folder || (folderId === 'root' ? { id: 'root', name: 'Home', parentId: null } : null),
            folders: subfolders,
            files: files,
            breadcrumbs
        };
    },

    createFolder: async (name: string, parentId: string) => {
        await connectToDatabase();
        const newFolder = await LibraryFolder.create({
            id: `fold-${Date.now()}`,
            name,
            parentId,
            path: '',
            createdAt: new Date().toISOString()
        });
        return newFolder;
    },

    uploadContent: async (contentData: Omit<LibraryContentType, 'id' | 'lastModified' | 'status'>) => {
        await connectToDatabase();
        const newContent = await LibraryContent.create({
            id: `cnt-${Date.now()}`,
            ...contentData,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'Published'
        });
        return newContent;
    },

    deleteItem: async (id: string, type: 'folder' | 'file') => {
        await connectToDatabase();
        if (type === 'folder') {
            const deleteFolder = async (fid: string) => {
                await LibraryContent.deleteMany({ folderId: fid });
                const subs = await LibraryFolder.find({ parentId: fid });
                for (const sub of subs) {
                    await deleteFolder(sub.id);
                }
                await LibraryFolder.deleteOne({ id: fid });
            };
            await deleteFolder(id);
        } else {
            await LibraryContent.deleteOne({ id });
        }
        return { success: true };
    },

    renameItem: async (id: string, type: 'folder' | 'file', newName: string) => {
        await connectToDatabase();
        if (type === 'folder') {
            await LibraryFolder.updateOne({ id }, { name: newName });
        } else {
            await LibraryContent.updateOne({ id }, { title: newName });
        }
        return { success: true };
    }
};
