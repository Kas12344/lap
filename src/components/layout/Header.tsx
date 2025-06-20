
"use client";

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <Logo />
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium">
              Products
            </Link>
            <Link href="/admin" className="text-foreground hover:text-primary transition-colors font-medium">
              Admin
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-foreground" />
                {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {/* Placeholder for auth/profile icon */}
             {/* <Button variant="ghost" size="icon" aria-label="User Profile">
              <User className="h-6 w-6 text-foreground" />
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
