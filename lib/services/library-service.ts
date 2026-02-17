import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'library.json');

export interface LibraryFolder {
    id: string;
    name: string;
    parentId: string | null;
    path: string;
    createdAt: string;
}

export interface LibraryContent {
    id: string;
    title: string;
    type: 'Video' | 'PDF' | 'Image' | 'Doc' | 'Other';
    url?: string; // For videos
    fileUrl?: string; // For uploaded files (simulated)
    folderId: string;
    size: string;
    lastModified: string;
    status: 'Published' | 'Draft' | 'Archived';
    courseIds: string[]; // Linked courses
    description?: string;
}

export interface LibraryData {
    folders: LibraryFolder[];
    content: LibraryContent[];
}

function readData(): LibraryData {
    if (!fs.existsSync(DATA_FILE)) {
        return { folders: [], content: [] };
    }
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch (e) {
        return { folders: [], content: [] };
    }
}

function writeData(data: LibraryData) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const libraryService = {
    getContents: async (folderId: string = 'root') => {
        const data = readData();
        const folder = (data.folders || []).find(f => f.id === folderId);
        const subfolders = (data.folders || []).filter(f => f.parentId === folderId);
        const files = (data.content || []).filter(c => c.folderId === folderId);

        // Get breadcrumbs
        const breadcrumbs = [];
        let current = folder;
        while (current) {
            breadcrumbs.unshift({ id: current.id, name: current.name });
            if (current.parentId) {
                current = (data.folders || []).find(f => f.id === current?.parentId);
            } else {
                current = undefined;
            }
        }

        return {
            folder,
            folders: subfolders,
            files,
            breadcrumbs
        };
    },

    createFolder: async (name: string, parentId: string) => {
        const data = readData();
        const newFolder: LibraryFolder = {
            id: `fold-${Date.now()}`,
            name,
            parentId,
            path: '', // TODO: Compute path if needed, but hierarchy via parentId is enough
            createdAt: new Date().toISOString()
        };
        data.folders.push(newFolder);
        writeData(data);
        return newFolder;
    },

    uploadContent: async (contentData: Omit<LibraryContent, 'id' | 'lastModified' | 'status'>) => {
        const data = readData();
        const newContent: LibraryContent = {
            id: `cnt-${Date.now()}`,
            ...contentData,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'Published'
        };
        data.content.push(newContent);
        writeData(data);
        return newContent;
    },

    deleteItem: async (id: string, type: 'folder' | 'file') => {
        const data = readData();
        if (type === 'folder') {
            // Recursive delete or block if not empty? 
            // Simple: Delete folder and its children.
            const deleteFolder = (fid: string) => {
                // Delete files in folder
                data.content = data.content.filter(c => c.folderId !== fid);
                // Find subfolders
                const subs = data.folders.filter(f => f.parentId === fid);
                subs.forEach(s => deleteFolder(s.id));
                // Delete folder
                data.folders = data.folders.filter(f => f.id !== fid);
            };
            deleteFolder(id);
        } else {
            data.content = data.content.filter(c => c.id !== id);
        }
        writeData(data);
        return { success: true };
    },

    renameItem: async (id: string, type: 'folder' | 'file', newName: string) => {
        const data = readData();
        if (type === 'folder') {
            const folder = data.folders.find(f => f.id === id);
            if (folder) folder.name = newName;
        } else {
            const file = data.content.find(c => c.id === id);
            if (file) file.title = newName;
        }
        writeData(data);
        return { success: true };
    }
};
