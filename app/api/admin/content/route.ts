import { NextRequest, NextResponse } from 'next/server';
import { libraryService } from '@/lib/services/library-service';
// import { libraryService } from '../../../lib/services/library-service'; // Correct path if alias fails? No, @ should work.

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get('folderId') || 'root';

    try {
        const data = await libraryService.getContents(folderId);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action } = body;

        let result;
        if (action === 'createFolder') {
            const { name, parentId } = body;
            result = await libraryService.createFolder(name, parentId);
        } else if (action === 'upload') {
            // contentData includes title, type, url/fileUrl, folderId, size, courseIds
            const { contentData } = body;
            result = await libraryService.uploadContent(contentData);
        } else if (action === 'delete') {
            const { id, type } = body;
            result = await libraryService.deleteItem(id, type);
        } else if (action === 'rename') {
            const { id, type, newName } = body;
            result = await libraryService.renameItem(id, type, newName);
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
