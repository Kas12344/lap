
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, MinusCircle, ShoppingBag, MessageSquare } from 'lucide-react';
import type { CustomerDetails } from '@/types';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getItemCount, clearCart, checkoutWithWhatsApp } = useCart();
  const { toast } = useToast();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key in keyof CustomerDetails]?: string }>({});

  const handleQuantityChange = (laptopId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.laptop.id === laptopId);
    if (item && newQuantity > item.laptop.stock) {
      toast({
        title: "Stock limit reached",
        description: `Cannot add more than ${item.laptop.stock} units of ${item.laptop.name}.`,
        variant: "destructive",
      });
      updateQuantity(laptopId, item.laptop.stock);
    } else if (newQuantity < 1) {
      removeFromCart(laptopId);
      toast({
        title: `${item?.laptop.name} removed from cart.`,
        variant: "default",
      });
    }
     else {
      updateQuantity(laptopId, newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CustomerDetails]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key in keyof CustomerDetails]?: string } = {};
    if (!customerDetails.name.trim()) errors.name = "Name is required.";
    if (!customerDetails.phone.trim()) errors.phone = "Phone number is required.";
    else if (!/^\+?[0-9\s-]{10,15}$/.test(customerDetails.phone)) errors.phone = "Invalid phone number format.";
    if (!customerDetails.address.trim()) errors.address = "Address is required.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      checkoutWithWhatsApp(customerDetails);
      toast({
        title: "Redirecting to WhatsApp",
        description: "Your order message is being prepared.",
      });
      // Optionally clear cart after successful checkout initiation
      // clearCart(); 
      // setCustomerDetails({ name: '', phone: '', address: '' });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  if (getItemCount() === 0) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any laptops yet.</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-foreground mb-8 font-headline">Your Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-foreground mb-4">Cart Items ({getItemCount()})</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map(item => (
                <TableRow key={item.laptop.id}>
                  <TableCell>
                    <Image
                      src={item.laptop.imageUrl || "https://placehold.co/100x100.png"}
                      alt={item.laptop.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                      data-ai-hint={item.laptop.dataAiHint || item.laptop.brand.toLowerCase() + ' product image'}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/products/${item.laptop.id}`} className="font-medium hover:text-primary">
                      {item.laptop.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.laptop.brand}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.laptop.id, item.quantity - 1)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.laptop.id, item.quantity + 1)}
                        disabled={item.quantity >= item.laptop.stock}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                     {item.quantity >= item.laptop.stock && <p className="text-xs text-destructive mt-1">Max stock</p>}
                  </TableCell>
                  <TableCell className="text-right">{item.laptop.price.toLocaleString()} PKR</TableCell>
                  <TableCell className="text-right">{(item.laptop.price * item.quantity).toLocaleString()} PKR</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/80 h-8 w-8"
                      onClick={() => {
                        removeFromCart(item.laptop.id);
                        toast({ title: `${item.laptop.name} removed from cart.` });
                      }}
                      aria-label={`Remove ${item.laptop.name} from cart`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => {
              clearCart();
              toast({ title: "Cart cleared!" });
            }}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md space-y-6 sticky top-24">
          <h2 className="text-xl font-semibold text-foreground border-b pb-3">Order Summary</h2>
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({getItemCount()} items)</span>
            <span>{getCartTotal().toLocaleString()} PKR</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold text-foreground">
            <span>Total</span>
            <span>{getCartTotal().toLocaleString()} PKR</span>
          </div>
          
          <Separator />
          
          <h2 className="text-xl font-semibold text-foreground border-b pb-3 pt-2">Customer Details</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                required
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (WhatsApp)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customerDetails.phone}
                onChange={handleInputChange}
                placeholder="e.g. +923001234567"
                required
                className={formErrors.phone ? 'border-destructive' : ''}
              />
              {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                name="address"
                value={customerDetails.address}
                onChange={handleInputChange}
                placeholder="e.g. House 123, Street 4, Lahore"
                required
                className={formErrors.address ? 'border-destructive' : ''}
              />
              {formErrors.address && <p className="text-xs text-destructive mt-1">{formErrors.address}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 shadow-md">
              <MessageSquare className="mr-2 h-5 w-5" />
              Checkout via WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CartPage;

    