
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addLaptopAdmin, updateLaptopAdmin, deleteLaptopAdmin, _updateLaptopsDataStore, getAllLaptopsAdmin } from '@/lib/data';
import type { Laptop, LaptopCondition } from '@/types';
import { CONDITION_OPTIONS } from '@/lib/constants';

// Define Zod schema for validation
const productActionSchema = z.object({
  name: z.string().min(3),
  brand: z.string().min(1),
  ram: z.string().min(1),
  processor: z.string().min(1),
  storage: z.string().min(1),
  graphics: z.string().min(1),
  display: z.string().min(1),
  price: z.number().min(1),
  condition: z.enum(CONDITION_OPTIONS as [LaptopCondition, ...LaptopCondition[]]),
  imageUrl: z.string().url("Main image must be a valid URL or Data URI.").optional().or(z.literal('')),
  dataAiHint: z.string().max(50).optional(),
  images: z.array(z.string().url("Each additional image must be a valid URL or Data URI.")).optional(), // For additional images (Data URIs or URLs)
  specs: z.string().min(10),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  stock: z.number().min(0).default(0),
});

export async function handleAddLaptop(formData: Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'>) {
  const validatedFields = productActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    throw new Error('Validation Error: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors));
  }

  try {
    // Ensure images is an array even if not provided or empty
    const dataToSave = {
      ...validatedFields.data,
      images: validatedFields.data.images || [],
    };
    const newLaptop = await addLaptopAdmin(dataToSave);
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, laptop: newLaptop };
  } catch (error) {
    console.error('Server Action Error (Add Laptop):', error);
    throw new Error('Failed to add laptop. ' + (error instanceof Error ? error.message : String(error)));
  }
}

export async function handleUpdateLaptop(id: string, formData: Partial<Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'>>) {
   const updateSchema = productActionSchema.partial();
   const validatedFields = updateSchema.safeParse(formData);

  if (!validatedFields.success) {
     throw new Error('Validation Error: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors));
  }

  try {
    // Ensure images is an array if being updated, otherwise it might be undefined from partial schema
    const dataToSave = {
      ...validatedFields.data,
      images: validatedFields.data.images !== undefined ? validatedFields.data.images : undefined, // keep as undefined if not passed to not overwrite with empty
    };

    const updatedLaptop = await updateLaptopAdmin(id, dataToSave);
    if (!updatedLaptop) {
      throw new Error('Laptop not found for update.');
    }
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${id}`);
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
    return { success: true, laptop: updatedLaptop };
  } catch (error) {
    console.error('Server Action Error (Update Laptop):', error);
    throw new Error('Failed to update laptop. ' + (error instanceof Error ? error.message : String(error)));
  }
}

export async function handleDeleteLaptop(id: string) {
  try {
    const success = await deleteLaptopAdmin(id);
    if (!success) {
      throw new Error('Failed to find or delete laptop.');
    }
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Server Action Error (Delete Laptop):', error);
    throw new Error('Failed to delete laptop. ' + (error instanceof Error ? error.message : String(error)));
  }
}
