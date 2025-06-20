
import ProductForm from '@/components/admin/ProductForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
