
'use server';

import connectToDatabase from '@/lib/mongoose';
import Material from '@/lib/models/Material';
import { Material as MaterialType } from '@/data/materials';

import { clean } from '@/lib/utils';

const scrubMaterial = (doc: any) => {
    const obj = clean(doc);
    if (obj) {
        delete obj._id;
        obj.id = doc.id;
    }
    return obj;
}

export async function getCourseMaterials(courseId: string): Promise<MaterialType[]> {
    await connectToDatabase();
    const materials = await Material.find({ courseId }).lean();
    return materials.map(scrubMaterial) as MaterialType[];
}

export async function getMaterialsByCourseIds(courseIds: string[]): Promise<MaterialType[]> {
    await connectToDatabase();
    if (!courseIds || courseIds.length === 0) return [];
    const materials = await Material.find({ courseId: { $in: courseIds } }).lean();
    return materials.map(clean) as MaterialType[];
}
