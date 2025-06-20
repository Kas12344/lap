
import ProductForm from '@/components/admin/ProductForm';
import { getLaptopById } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const laptop = await getLaptopById(params.id);

  if (!laptop) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Product Not Found</h2>
        <p className="text-muted-foreground">The product you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Edit Product: {laptop.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm laptopToEdit={laptop} />
        </CardContent>
      </Card>
    </div>
  );
}
