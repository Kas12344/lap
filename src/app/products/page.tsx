
import { Suspense } from 'react';
import { getLaptops } from '@/lib/data';
import ProductsPageClientContent from './ProductsPageClientContent';
import { Loader2 } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';

// This is now primarily a Server Component responsible for data fetching.
export default async function ProductsPage() {
  const allLaptops = await getLaptops(); // Fetch data on the server

  return (
    <PageWrapper>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground font-headline">Our Laptop Collection</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find the perfect device tailored to your needs.
        </p>
      </div>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <ProductsPageClientContent initialLaptops={allLaptops} />
      </Suspense>
    </PageWrapper>
  );
}
