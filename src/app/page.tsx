
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '@/components/layout/PageWrapper';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { getNewArrivals, getFeaturedLaptops, getPopularBrands } from '@/lib/data';
import type { Laptop, Brand } from '@/types';
import { ChevronRight } from 'lucide-react';

export default async function HomePage() {
  const newArrivals: Laptop[] = await getNewArrivals(4);
  const featuredLaptops: Laptop[] = await getFeaturedLaptops(4);
  const popularBrands: Brand[] = await getPopularBrands(); // Assuming this returns a few top brands

  return (
    <PageWrapper>
      {/* Hero Section Placeholder */}
      <section className="mb-16 text-center bg-card p-8 md:p-12 rounded-xl shadow-xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline">
          Welcome to Lapzen!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover the latest laptops and get the best deals. Order easily via WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8 shadow-md" asChild>
            <Link href="/products">Shop All Laptops</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg py-3 px-8" asChild>
            <Link href="#new-arrivals">New Arrivals</Link>
          </Button>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals" className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground font-headline">New Arrivals</h2>
            <Button variant="link" className="text-primary hover:text-primary/80" asChild>
              <Link href="/products?filter=new">
                View All <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((laptop) => (
              <ProductCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Laptops Section */}
      {featuredLaptops.length > 0 && (
        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground font-headline">Featured Laptops</h2>
            <Button variant="link" className="text-primary hover:text-primary/80" asChild>
              <Link href="/products?filter=featured">
                View All <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLaptops.map((laptop) => (
              <ProductCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Brands Section */}
      {popularBrands.length > 0 && (
         <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-10 font-headline">Shop by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {popularBrands.map((brand) => (
              <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.name)}`} className="group">
                <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                  {/* Placeholder for brand logo if available */}
                  {/* <Image src={brand.logoUrl || `https://placehold.co/100x50.png?text=${brand.name}`} alt={`${brand.name} logo`} width={100} height={50} className="mx-auto mb-3 h-12 object-contain" data-ai-hint="brand logo" /> */}
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
             {/* Fallback if popularBrands is empty but we have brands in constants */}
            {(popularBrands.length === 0 && ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'].length > 0) && 
              ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus'].map((brandName) => (
              <Link key={brandName} href={`/products?brand=${encodeURIComponent(brandName)}`} className="group">
                <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brandName}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action for WhatsApp */}
      <section className="bg-accent text-accent-foreground p-8 md:p-12 rounded-xl shadow-xl text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Questions or Ready to Order?</h2>
        <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">
          Contact us directly on WhatsApp for quick support and to place your order.
        </p>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-accent-foreground hover:bg-accent-foreground/10 text-lg py-3 px-8 shadow-md"
          asChild
        >
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923090009022'}`} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </Button>
      </section>
    </PageWrapper>
  );
}
