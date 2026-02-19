
'use server';

import connectToDatabase from '@/lib/mongoose';
import Material from '@/lib/models/Material';
import { Material as MaterialType } from '@/data/materials';

const clean = (doc: any) => {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { ...rest, id: doc.id };
}

export async function getCourseMaterials(courseId: string): Promise<MaterialType[]> {
    await connectToDatabase();
    const materials = await Material.find({ courseId }).lean();
    return materials.map(clean) as MaterialType[];
}
