
import Link from 'next/link';
import Image from 'next/image';
import { getAllLaptopsAdmin } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import DeleteProductDialog from '@/components/admin/DeleteProductDialog';

export default async function AdminProductsPage() {
  const laptops = await getAllLaptopsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
        <Link href="/admin/products/add">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </Link>
      </div>

      {laptops.length === 0 ? (
        <p className="text-muted-foreground">No products found. Add your first product!</p>
      ) : (
        <div className="bg-card p-6 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Price (PKR)</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Condition</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laptops.map((laptop) => (
                <TableRow key={laptop.id}>
                  <TableCell>
                    <Image
                      src={laptop.imageUrl || "https://placehold.co/100x100.png"}
                      alt={laptop.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                      data-ai-hint={laptop.dataAiHint || `${laptop.brand} laptop`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{laptop.name}</TableCell>
                  <TableCell>{laptop.brand}</TableCell>
                  <TableCell className="text-right">{laptop.price.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={laptop.stock > 0 ? 'default' : 'destructive'}>
                      {laptop.stock > 0 ? laptop.stock : 'Out'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{laptop.condition}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Link href={`/admin/products/edit/${laptop.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit product">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteProductDialog productId={laptop.id} productName={laptop.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
