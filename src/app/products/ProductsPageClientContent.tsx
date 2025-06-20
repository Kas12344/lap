
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import type { Laptop, LaptopCondition } from '@/types';
// getLaptops is no longer needed here as data is passed via props
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { POPULAR_BRANDS, RAM_OPTIONS, PROCESSOR_OPTIONS, CONDITION_OPTIONS } from '@/lib/constants';
import { XCircle, Loader2 } from 'lucide-react';

// Unique values for "all" or "any" options in SelectItem
const ALL_BRANDS_VALUE = "all_brands_option";
const ANY_RAM_VALUE = "any_ram_option";
const ANY_PROCESSOR_VALUE = "any_processor_option";
const ANY_CONDITION_VALUE = "any_condition_option";

interface ProductsPageClientContentProps {
  initialLaptops: Laptop[];
}

export default function ProductsPageClientContent({ initialLaptops }: ProductsPageClientContentProps) {
  const searchParams = useSearchParams();
  const [laptops, setLaptops] = useState<Laptop[]>(initialLaptops);
  
  // Update laptops state if initialLaptops prop changes (e.g., after router.refresh or revalidation)
  useEffect(() => {
    setLaptops(initialLaptops);
  }, [initialLaptops]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchQuery') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedCondition, setSelectedCondition] = useState<LaptopCondition | ''>('');
  
  const initialFilterFromUrl = searchParams.get('filter');
  const [initialFilterApplied, setInitialFilterApplied] = useState(initialFilterFromUrl);


  useEffect(() => {
    // This effect updates filters based on URL search params when the component mounts or searchParams change.
    setSearchTerm(searchParams.get('searchQuery') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setInitialFilterApplied(searchParams.get('filter'));
    // Note: Other filters like RAM, processor, price, condition are not typically set via simple URL params here,
    // but this could be extended if needed.
  }, [searchParams]);


  const filteredLaptops = useMemo(() => {
    return laptops.filter(laptop => {
      let matches = true;
      if (searchTerm && !(laptop.name.toLowerCase().includes(searchTerm.toLowerCase()) || laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()))) {
        matches = false;
      }
      if (selectedBrand && selectedBrand !== ALL_BRANDS_VALUE && laptop.brand !== selectedBrand) {
        matches = false;
      }
      if (selectedRam && selectedRam !== ANY_RAM_VALUE && !laptop.ram.includes(selectedRam)) {
        matches = false;
      }
      if (selectedProcessor && selectedProcessor !== ANY_PROCESSOR_VALUE && !laptop.processor.toLowerCase().includes(selectedProcessor.toLowerCase())) {
        matches = false;
      }
      if (laptop.price < priceRange[0] || laptop.price > priceRange[1]) {
        matches = false;
      }
      if (selectedCondition && selectedCondition !== ANY_CONDITION_VALUE && laptop.condition !== selectedCondition) {
        matches = false;
      }
      if (initialFilterApplied === 'featured' && !laptop.featured) {
        matches = false;
      }
      if (initialFilterApplied === 'new' && !laptop.newArrival) {
        matches = false;
      }
      return matches;
    });
  }, [laptops, searchTerm, selectedBrand, selectedRam, selectedProcessor, priceRange, selectedCondition, initialFilterApplied]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedRam('');
    setSelectedProcessor('');
    setPriceRange([0, 500000]);
    setSelectedCondition('');
    setInitialFilterApplied(null); 
    // Optionally, you might want to update URL search params here too using router.push
  };
  
  const activeFilterCount = [
    searchTerm, 
    selectedBrand && selectedBrand !== ALL_BRANDS_VALUE, 
    selectedRam && selectedRam !== ANY_RAM_VALUE, 
    selectedProcessor && selectedProcessor !== ANY_PROCESSOR_VALUE, 
    selectedCondition && selectedCondition !== ANY_CONDITION_VALUE, 
    (priceRange[0] !== 0 || priceRange[1] !== 500000),
    initialFilterApplied
  ].filter(Boolean).length;

  return (
    <>
      <div className="mb-10 p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground">Search</label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="brand-select" className="block text-sm font-medium text-foreground">Brand</label>
            <Select value={selectedBrand} onValueChange={(value) => setSelectedBrand(value)}>
              <SelectTrigger id="brand-select">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_BRANDS_VALUE}>All Brands</SelectItem>
                {POPULAR_BRANDS.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="ram-select" className="block text-sm font-medium text-foreground">RAM</label>
            <Select value={selectedRam} onValueChange={(value) => setSelectedRam(value)}>
              <SelectTrigger id="ram-select">
                <SelectValue placeholder="Any RAM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_RAM_VALUE}>Any RAM</SelectItem>
                {RAM_OPTIONS.map(ram => (
                  <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="processor-select" className="block text-sm font-medium text-foreground">Processor</label>
            <Select value={selectedProcessor} onValueChange={(value) => setSelectedProcessor(value)}>
              <SelectTrigger id="processor-select">
                <SelectValue placeholder="Any Processor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_PROCESSOR_VALUE}>Any Processor</SelectItem>
                {PROCESSOR_OPTIONS.map(proc => (
                  <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 lg:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} PKR
            </label>
            <Slider
              min={0}
              max={500000}
              step={10000}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="pt-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="condition-select" className="block text-sm font-medium text-foreground">Condition</label>
            <Select value={selectedCondition} onValueChange={(value) => setSelectedCondition(value as LaptopCondition | '')}>
              <SelectTrigger id="condition-select">
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_CONDITION_VALUE}>Any Condition</SelectItem>
                {CONDITION_OPTIONS.map(cond => (
                  <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {activeFilterCount > 0 && (
             <Button onClick={clearFilters} variant="ghost" className="text-accent hover:text-accent/90 w-full md:w-auto mt-4 md:mt-0 self-end">
               <XCircle className="mr-2 h-4 w-4" /> Clear Filters ({activeFilterCount})
             </Button>
          )}
        </div>
      </div>

      {filteredLaptops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLaptops.map(laptop => (
            <ProductCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl text-muted-foreground">No laptops found.</p>
          {activeFilterCount > 0 && laptops.length > 0 && (
            <p className="text-md text-muted-foreground mt-2">Try adjusting your filters.</p>
          )}
          {laptops.length === 0 && activeFilterCount === 0 && (
             <p className="text-md text-muted-foreground mt-2">Add some products in the admin panel to see them here.</p>
          )}
          {activeFilterCount > 0 && (
            <Button onClick={clearFilters} variant="link" className="mt-4 text-primary">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </>
  );
}

