
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Laptop } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  laptop: Laptop;
}

const ProductCard: React.FC<ProductCardProps> = ({ laptop }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if button inside Link
    e.stopPropagation();
    addToCart(laptop);
    toast({
      title: `${laptop.name} added to cart!`,
      description: "You can view your cart or continue shopping.",
      variant: "default",
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-fade-in">
      <Link href={`/products/${laptop.id}`} className="block group"> {/* Added group for hover effects if needed */}
        <CardHeader className="p-0 relative">
          <Image
            src={laptop.imageUrl || "https://placehold.co/600x400.png"}
            alt={laptop.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={laptop.dataAiHint || laptop.brand.toLowerCase() + ' laptop'}
          />
          {laptop.newArrival && (
            <Badge variant="destructive" className="absolute top-2 right-2">New</Badge>
          )}
           {laptop.featured && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-accent text-accent-foreground">Featured</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {laptop.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-1">{laptop.brand}</p>
          <p className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
            {laptop.processor} / {laptop.ram} / {laptop.storage}
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-primary">
              {laptop.price.toLocaleString()} PKR
            </p>
            <Badge variant={laptop.condition === 'New' ? 'default' : 'outline'}>
              {laptop.condition}
            </Badge>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 border-t mt-auto">
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={laptop.stock <= 0}
            aria-label={laptop.stock > 0 ? `Add ${laptop.name} to cart` : `${laptop.name} is out of stock`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {laptop.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/products/${laptop.id}`}>
              <Info className="mr-2 h-4 w-4" /> Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

    