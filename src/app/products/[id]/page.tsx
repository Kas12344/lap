
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Laptop } from '@/types';
import { getLaptopById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { generateSpecSummary, type GenerateSpecSummaryInput, type GenerateSpecSummaryOutput } from '@/ai/flows/generate-spec-summary';

interface ProductPageProps {
  params: { id: string };
}

const ProductDetailPage: React.FC<ProductPageProps> = ({ params }) => {
  const { id } = params;
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLaptop = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLaptop = await getLaptopById(id);
        if (fetchedLaptop) {
          setLaptop(fetchedLaptop);
          setSelectedImage(fetchedLaptop.imageUrl); // Set main image as initially selected
        } else {
          setError('Laptop not found.');
        }
      } catch (e) {
        setError('Failed to load laptop details.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchLaptop();
    }
  }, [id]);

  useEffect(() => {
    // Update selected image if laptop data changes (e.g. main image URL updated)
    if (laptop) {
        // If current selectedImage is not in the new list of images (main + additional), reset to main.
        const allImages = [laptop.imageUrl, ...(laptop.images || [])];
        if (selectedImage && !allImages.includes(selectedImage)) {
            setSelectedImage(laptop.imageUrl);
        } else if (!selectedImage) {
            setSelectedImage(laptop.imageUrl);
        }
    }
  }, [laptop, selectedImage]);


  const handleGenerateSummary = async () => {
    if (!laptop) return;
    setIsSummaryLoading(true);
    setAiSummary(null);
    try {
      const input: GenerateSpecSummaryInput = { specs: laptop.specs };
      const output: GenerateSpecSummaryOutput = await generateSpecSummary(input);
      setAiSummary(output.summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      setAiSummary("Could not generate summary at this time. Please try again.");
      toast({
        title: "AI Summary Error",
        description: "Failed to generate the AI summary. Please check the console for details or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (laptop) {
      addToCart(laptop);
      toast({
        title: `${laptop.name} added to cart!`,
        description: "You can view your cart or continue shopping.",
      });
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-center py-10 bg-card rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Product</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
        </div>
      </PageWrapper>
    );
  }

  if (!laptop) {
    return (
      <PageWrapper>
        <div className="text-center py-10 bg-card rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Laptop Not Found</h2>
          <p className="text-muted-foreground">The laptop you are looking for does not exist or has been removed.</p>
          <Link href="/products">
            <Button variant="outline" className="mt-6">Browse Other Laptops</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const allDisplayImages = [laptop.imageUrl, ...(laptop.images || [])].filter(Boolean);


  return (
    <PageWrapper className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-xl">
          <div className="mb-4">
            <Image
              src={selectedImage || laptop.imageUrl || "https://placehold.co/600x400.png"}
              alt={laptop.name + (selectedImage !== laptop.imageUrl ? ' - Additional View' : ' - Main View')}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-md aspect-video md:aspect-[4/3]"
              priority // Prioritize loading the main product image
              data-ai-hint={laptop.dataAiHint || `${laptop.brand.toLowerCase()} ${laptop.name.toLowerCase().split(' ')[0]}`}
            />
          </div>
          {allDisplayImages && allDisplayImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4">
              {allDisplayImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`rounded-md overflow-hidden border-2 transition-all ${selectedImage === imgUrl ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted-foreground/50'}`}
                >
                  <Image
                    src={imgUrl || "https://placehold.co/100x75.png"}
                    alt={`${laptop.name} thumbnail ${index + 1}`}
                    width={100}
                    height={75}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline">{laptop.name}</h1>
            <p className="text-lg text-muted-foreground">{laptop.brand}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-primary">{laptop.price.toLocaleString()} PKR</p>
            <Badge variant={laptop.condition === 'New' ? 'default' : 'outline'} className="text-sm px-3 py-1 rounded-full">
              {laptop.condition}
            </Badge>
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-sm text-foreground">
            <h3 className="text-md font-semibold mb-2 text-foreground">Specifications:</h3>
            <p><strong>Processor:</strong> {laptop.processor}</p>
            <p><strong>RAM:</strong> {laptop.ram}</p>
            <p><strong>Storage:</strong> {laptop.storage}</p>
            <p><strong>Graphics:</strong> {laptop.graphics}</p>
            <p><strong>Display:</strong> {laptop.display}</p>
            <p><strong>Stock:</strong> {laptop.stock > 0 ? <span className="text-green-600 font-medium">{laptop.stock} available</span> : <span className="text-destructive font-medium">Out of Stock</span>}</p>
          </div>

          {laptop.description && (
            <div className="bg-card/50 p-4 rounded-lg border border-border">
              <h3 className="text-md font-semibold mb-2 text-foreground">Description:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{laptop.description}</p>
            </div>
          )}

          <div className="bg-card/50 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-foreground">AI Generated Summary</h3>
              <Button onClick={handleGenerateSummary} variant="outline" size="sm" disabled={isSummaryLoading}>
                {isSummaryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {aiSummary ? "Regenerate" : "Generate"}
              </Button>
            </div>
            {isSummaryLoading && !aiSummary && <p className="text-sm text-muted-foreground italic">Generating summary... This may take a moment.</p>}
            {aiSummary && <p className="text-sm text-muted-foreground whitespace-pre-line">{aiSummary}</p>}
            {!aiSummary && !isSummaryLoading && <p className="text-sm text-muted-foreground italic">Click 'Generate' to get an AI-powered summary of the laptop's key features based on its specifications.</p>}
          </div>

          <Button
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 shadow-md hover:shadow-lg transition-shadow"
            onClick={handleAddToCart}
            disabled={laptop.stock <= 0}
            aria-label={laptop.stock > 0 ? `Add ${laptop.name} to cart` : `${laptop.name} is out of stock`}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {laptop.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductDetailPage;
