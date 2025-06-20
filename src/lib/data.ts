
import { db } from './firebase'; // Import Firestore instance
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
  QueryConstraint
} from 'firebase/firestore';
import type { Laptop, Brand, LaptopCondition } from '@/types';
import { POPULAR_BRANDS as POPULAR_BRAND_NAMES } from './constants'; // For getPopularBrands

const LAPTOPS_COLLECTION = 'laptops';

// Helper to convert Firestore doc data to Laptop type
const laptopFromDoc = (docSnapshot: ReturnType<typeof doc> | any): Laptop => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    // Convert Firestore Timestamps to ISO strings if they exist
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
    images: data.images || [], // Ensure images is an array
  } as Laptop;
};


export const getLaptops = async (filters?: {
  brand?: string;
  ram?: string;
  processor?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: LaptopCondition;
  searchQuery?: string;
}): Promise<Laptop[]> => {
  if (!db) {
    console.error("Firestore not initialized");
    return [];
  }
  const laptopsCol = collection(db, LAPTOPS_COLLECTION);
  const queryConstraints: QueryConstraint[] = [];

  if (filters) {
    if (filters.brand) {
      queryConstraints.push(where('brand', '==', filters.brand));
    }
    if (filters.ram) {
      // Firestore doesn't support partial string matches like 'includes' directly in queries for general fields.
      // This would typically require a more advanced search solution (e.g., Algolia, Typesense) or
      // fetching all and filtering client-side (less efficient for large datasets).
      // For now, we'll filter client-side after fetching or omit this filter.
      // console.warn("RAM filtering by 'includes' is not directly supported by Firestore queries. Consider alternative approaches.");
    }
    if (filters.processor) {
       // Similar to RAM, direct 'includes' is not supported for processor field.
       // console.warn("Processor filtering by 'includes' is not directly supported by Firestore queries.");
    }
    if (filters.minPrice !== undefined) {
      queryConstraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      queryConstraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.condition) {
      queryConstraints.push(where('condition', '==', filters.condition));
    }
    // Full-text search (filters.searchQuery) is not natively supported by Firestore in a simple way.
    // Requires third-party search services like Algolia or Typesense for efficient searching.
    // For now, we'll fetch all and filter client-side if a search query is present without other specific field filters.
  }

  const q = query(laptopsCol, ...queryConstraints);
  try {
    const querySnapshot = await getDocs(q);
    let laptops = querySnapshot.docs.map(laptopFromDoc);

    // Client-side filtering for RAM, Processor, and SearchQuery due to Firestore limitations on partial matches
    if (filters) {
        if (filters.ram) {
            laptops = laptops.filter(laptop => laptop.ram.toLowerCase().includes(filters.ram!.toLowerCase()));
        }
        if (filters.processor) {
            laptops = laptops.filter(laptop => laptop.processor.toLowerCase().includes(filters.processor!.toLowerCase()));
        }
        if (filters.searchQuery) {
            const sQuery = filters.searchQuery.toLowerCase();
            laptops = laptops.filter(laptop =>
                laptop.name.toLowerCase().includes(sQuery) ||
                laptop.brand.toLowerCase().includes(sQuery) ||
                laptop.processor.toLowerCase().includes(sQuery) ||
                (laptop.description && laptop.description.toLowerCase().includes(sQuery))
            );
        }
    }
    return laptops;
  } catch (error) {
    console.error("Error fetching laptops: ", error);
    return [];
  }
};

export const getLaptopById = async (id: string): Promise<Laptop | undefined> => {
  if (!db) {
    console.error("Firestore not initialized");
    return undefined;
  }
  try {
    const docRef = doc(db, LAPTOPS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return laptopFromDoc(docSnap);
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching laptop by ID: ", error);
    return undefined;
  }
};


export const getBrands = async (): Promise<Brand[]> => {
  // This function will now derive brands from the laptops in Firestore
  // or you could create a separate 'brands' collection.
  // For simplicity, let's derive from laptops for now.
  if (!db) {
    console.error("Firestore not initialized");
    return [];
  }
  try {
    const laptopsCol = collection(db, LAPTOPS_COLLECTION);
    const snapshot = await getDocs(laptopsCol);
    const brandNames = new Set<string>();
    snapshot.docs.forEach(doc => {
      brandNames.add(doc.data().brand);
    });
    return Array.from(brandNames).map((name, index) => ({ id: String(index), name }));
  } catch (error) {
    console.error("Error fetching brands: ", error);
    return [];
  }
};

export const getFeaturedLaptops = async (count: number = 4): Promise<Laptop[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, LAPTOPS_COLLECTION), where('featured', '==', true), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(laptopFromDoc);
  } catch (error) {
    console.error("Error fetching featured laptops: ", error);
    return [];
  }
};

export const getNewArrivals = async (count: number = 4): Promise<Laptop[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, LAPTOPS_COLLECTION), where('newArrival', '==', true), orderBy('createdAt', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(laptopFromDoc);
  } catch (error) {
    console.error("Error fetching new arrivals: ", error);
    return [];
  }
};

export const getPopularBrands = async (): Promise<Brand[]> => {
  // This will return brands based on the POPULAR_BRAND_NAMES constant
  // Optionally, you could verify these brands exist in your database.
  return POPULAR_BRAND_NAMES.map((name, index) => ({ id: String(index), name }));
};

// Admin functions
export const addLaptopAdmin = async (laptopData: Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Laptop> => {
  if (!db) {
    console.error("Firestore not initialized for addLaptopAdmin");
    throw new Error("Database not available");
  }
  try {
    const dataToSave = {
      ...laptopData,
      images: laptopData.images || [], // Ensure images is an array
      price: Number(laptopData.price), // Ensure price is a number
      stock: Number(laptopData.stock), // Ensure stock is a number
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, LAPTOPS_COLLECTION), dataToSave);
    // To return the full Laptop object including the auto-generated ID and timestamps,
    // we fetch the document we just created.
    const newDocSnap = await getDoc(docRef);
    return laptopFromDoc(newDocSnap);
  } catch (error) {
    console.error("Error adding laptop: ", error);
    throw error; // Re-throw to be caught by server action
  }
};

export const updateLaptopAdmin = async (id: string, laptopData: Partial<Omit<Laptop, 'id' | 'createdAt'>>): Promise<Laptop | null> => {
  if (!db) {
    console.error("Firestore not initialized for updateLaptopAdmin");
    throw new Error("Database not available");
  }
  try {
    const docRef = doc(db, LAPTOPS_COLLECTION, id);
    const dataToUpdate = {
      ...laptopData,
      // Ensure numeric fields are numbers if they are present in laptopData
      ...(laptopData.price !== undefined && { price: Number(laptopData.price) }),
      ...(laptopData.stock !== undefined && { stock: Number(laptopData.stock) }),
      images: laptopData.images || [], // Ensure images is an array or default to empty
      updatedAt: serverTimestamp(),
    };
    // Firestore's updateDoc only updates fields provided; it doesn't overwrite the whole document unless you use setDoc.
    // We remove undefined fields to avoid attempting to write 'undefined' to Firestore.
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]);


    await updateDoc(docRef, dataToUpdate);
    const updatedDocSnap = await getDoc(docRef);
    return laptopFromDoc(updatedDocSnap);
  } catch (error) {
    console.error("Error updating laptop: ", error);
    throw error;
  }
};

export const deleteLaptopAdmin = async (id: string): Promise<boolean> => {
  if (!db) {
    console.error("Firestore not initialized for deleteLaptopAdmin");
    throw new Error("Database not available");
  }
  try {
    const docRef = doc(db, LAPTOPS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting laptop: ", error);
    throw error;
  }
};

export const getAllLaptopsAdmin = async (): Promise<Laptop[]> => {
   if (!db) return [];
   try {
    const q = query(collection(db, LAPTOPS_COLLECTION), orderBy('createdAt', 'desc')); // Example ordering
    const snapshot = await getDocs(q);
    return snapshot.docs.map(laptopFromDoc);
  } catch (error) {
    console.error("Error fetching all laptops for admin: ", error);
    return [];
  }
}


// This function is no longer needed as data is in Firestore.
// If you need to batch update/seed data, you'd write a specific script.
export const _updateLaptopsDataStore = (updatedLaptops: Laptop[]) => {
  console.warn("_updateLaptopsDataStore is deprecated. Data is now managed in Firestore.");
  // Example of how you might batch write if needed for seeding (use with caution):
  // if (!db) return;
  // const batch = writeBatch(db);
  // updatedLaptops.forEach(laptop => {
  //   const { id, ...data } = laptop;
  //   const docRef = doc(db, LAPTOPS_COLLECTION, id || data.name.replace(/\s+/g, '-').toLowerCase()); // Ensure ID
  //   batch.set(docRef, {
  //       ...data,
  //       createdAt: data.createdAt ? Timestamp.fromDate(new Date(data.createdAt)) : serverTimestamp(),
  //       updatedAt: serverTimestamp()
  //   });
  // });
  // batch.commit().then(() => console.log("Batch write complete")).catch(e => console.error("Batch write error", e));
};
