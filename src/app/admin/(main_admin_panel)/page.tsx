
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Package, PlusCircle, BarChart3 } from 'lucide-react';
import { getAllLaptopsAdmin } from '@/lib/data';

export default async function AdminDashboardPage() {
  const laptops = await getAllLaptopsAdmin();
  const totalProducts = laptops.length;
  // Add more stats as needed, e.g., total stock value, recent orders (if implemented)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <Link href="/admin/products/add">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Currently listed laptops
            </p>
          </CardContent>
        </Card>
        
        {/* Example for another stat card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Overview</CardTitle> {/* Placeholder */}
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Sales data not yet implemented
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-x-4">
          <Link href="/admin/products">
            <Button variant="outline">Manage Products</Button>
          </Link>
          {/* Add other quick action buttons here */}
        </div>
      </div>
    </div>
  );
}
