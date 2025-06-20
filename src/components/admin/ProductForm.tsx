
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Laptop, LaptopCondition } from "@/types";
import { POPULAR_BRANDS, RAM_OPTIONS, PROCESSOR_OPTIONS, CONDITION_OPTIONS } from "@/lib/constants";
import { handleAddLaptop, handleUpdateLaptop } from '@/app/admin/(main_admin_panel)/actions';
import { Loader2, XCircle, UploadCloud } from "lucide-react";

const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  brand: z.string().min(1, "Brand is required."),
  ram: z.string().min(1, "RAM specification is required."),
  processor: z.string().min(1, "Processor specification is required."),
  storage: z.string().min(1, "Storage specification is required."),
  graphics: z.string().min(1, "Graphics specification is required."),
  display: z.string().min(1, "Display specification is required."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  condition: z.enum(CONDITION_OPTIONS as [LaptopCondition, ...LaptopCondition[]], { required_error: "Condition is required."}),
  imageUrl: z.string().url("Main image must be a valid URL (e.g., https://placehold.co/... or data:image/...).").optional().or(z.literal('')),
  dataAiHint: z.string().max(50).optional(), 
  specs: z.string().min(10, "Specs must be at least 10 characters for AI summary generation."),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  stock: z.coerce.number().min(0, "Stock cannot be negative.").default(0),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  laptopToEdit?: Laptop;
}

const MAX_ADDITIONAL_IMAGES = 5;
const MAX_MAIN_IMAGE_SIZE_MB = 5;
const MAX_ADDITIONAL_IMAGE_SIZE_MB = 2;

export default function ProductForm({ laptopToEdit }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]); // Stores Data URIs or existing URLs

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: laptopToEdit ? {
      ...laptopToEdit,
      imageUrl: laptopToEdit.imageUrl || '',
      dataAiHint: laptopToEdit.dataAiHint || '',
      description: laptopToEdit.description || '',
    } : {
      name: "",
      brand: "",
      ram: "",
      processor: "",
      storage: "",
      graphics: "",
      display: "",
      price: 0,
      condition: "New",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "",
      specs: "",
      description: "",
      featured: false,
      newArrival: true,
      stock: 10,
    },
    mode: "onChange",
  });
  
  useEffect(() => {
    if (laptopToEdit?.images) {
      setAdditionalImages(laptopToEdit.images);
    }
  }, [laptopToEdit]);

  const mainImageUrlValue = form.watch('imageUrl');
  const mainImageDataAiHintValue = form.watch('dataAiHint');

  const handleMainImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_MAIN_IMAGE_SIZE_MB * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `Main image must be smaller than ${MAX_MAIN_IMAGE_SIZE_MB}MB.`,
        });
        event.target.value = ""; 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string, { shouldValidate: true, shouldDirty: true });
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "Error reading file", description: "Could not read the main image file." });
      }
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentImageCount = additionalImages.length;
    if (files.length + currentImageCount > MAX_ADDITIONAL_IMAGES) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can upload a maximum of ${MAX_ADDITIONAL_IMAGES} additional images. Currently have ${currentImageCount}.`,
      });
      event.target.value = ""; // Reset file input
      return;
    }

    const filePromises: Promise<string>[] = [];
    const tooLargeFiles: string[] = [];
    const newSelectedFiles: File[] = Array.from(files);

    for (const file of newSelectedFiles) {
      if (file.size > MAX_ADDITIONAL_IMAGE_SIZE_MB * 1024 * 1024) {
        tooLargeFiles.push(file.name);
        continue;
      }
      filePromises.push(new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      }));
    }

    try {
      const newImageDataUris = await Promise.all(filePromises);
      setAdditionalImages(prevUris => [...prevUris, ...newImageDataUris]);
      
      if (newImageDataUris.length > 0) {
        toast({
          title: "Images selected",
          description: `${newImageDataUris.length} additional image(s) ready.`,
        });
      }
      if (tooLargeFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Some files too large",
          description: `Files: ${tooLargeFiles.join(", ")} exceeded ${MAX_ADDITIONAL_IMAGE_SIZE_MB}MB and were not added.`,
        });
      }
    } catch (error) {
      console.error("Error processing additional images:", error);
      toast({ variant: "destructive", title: "Error reading files", description: "Could not process some image files." });
    }
    event.target.value = ""; // Reset file input to allow re-selection of same files if needed
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setAdditionalImages(prev => prev.filter((_, index) => index !== indexToRemove));
    toast({ title: "Image removed", description: "Additional image has been removed." });
  };


  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);

    try {
      const laptopDataForAction = {
        ...data,
        imageUrl: data.imageUrl || "https://placehold.co/600x400.png", // Ensure imageUrl is not empty
        images: additionalImages, // Pass the array of Data URIs/URLs
      };
      
      if (laptopToEdit) {
        await handleUpdateLaptop(laptopToEdit.id, laptopDataForAction);
        toast({ title: "Success", description: "Product updated successfully." });
      } else {
        await handleAddLaptop(laptopDataForAction as Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'>);
        toast({ title: "Success", description: "Product added successfully." });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save product. " + (error instanceof Error ? error.message : String(error)) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input placeholder="e.g., Dell XPS 15" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {POPULAR_BRANDS.map(brand => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="ram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select RAM" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {RAM_OPTIONS.map(ram => <SelectItem key={ram} value={ram}>{ram}</SelectItem>)}
                     <SelectItem value="Other">Other (Specify Below)</SelectItem>
                  </SelectContent>
                </Select>
                {form.watch('ram') === "Other" && 
                  <FormControl>
                    <Input 
                      placeholder="Custom RAM e.g. 24GB DDR5" 
                      value={field.value === "Other" ? "" : field.value} // Clear if "Other" was just selected
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                }
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="processor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select processor" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {PROCESSOR_OPTIONS.map(proc => <SelectItem key={proc} value={proc}>{proc}</SelectItem>)}
                    <SelectItem value="Other">Other (Specify Below)</SelectItem>
                  </SelectContent>
                </Select>
                 {form.watch('processor') === "Other" && 
                  <FormControl>
                    <Input 
                      placeholder="Custom Processor" 
                      value={field.value === "Other" ? "" : field.value} 
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                 }
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage</FormLabel>
                <FormControl><Input placeholder="e.g., 512GB NVMe SSD" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="graphics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graphics Card</FormLabel>
                <FormControl><Input placeholder="e.g., NVIDIA RTX 4060" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="display"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display</FormLabel>
                <FormControl><Input placeholder="e.g., 15.6-inch QHD 165Hz" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (PKR)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 250000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-end">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {CONDITION_OPTIONS.map(cond => <SelectItem key={cond} value={cond}>{cond}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="specs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Specifications</FormLabel>
                <FormControl><Textarea placeholder="Detailed specifications for AI summary, e.g., Dell XPS 13, 16GB RAM, Core i7 11th Gen, 512GB SSD..." {...field} rows={4}/></FormControl>
                <FormDescription>This will be used to generate the AI summary on the product page.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description (Optional)</FormLabel>
                <FormControl><Textarea placeholder="A short, human-readable description or highlights of the laptop." {...field} rows={3}/></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium">Main Product Image</h3>
          <FormItem>
            <FormLabel>Main Image Preview</FormLabel>
            <div className="mt-2">
              <Image
                src={mainImageUrlValue || "https://placehold.co/300x200.png"}
                alt={form.getValues('name') || "Main Product Image Preview"}
                width={300}
                height={200}
                className="rounded-md object-cover border"
                data-ai-hint={mainImageDataAiHintValue || "product image"}
              />
            </div>
          </FormItem>

          <FormItem>
            <FormLabel>Upload Main Image File (Optional)</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleMainImageFileChange} />
            </FormControl>
            <FormDescription>
              Max {MAX_MAIN_IMAGE_SIZE_MB}MB. Uploaded image will populate the URL field below with a Data URI.
            </FormDescription>
          </FormItem>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image URL (or Data URI)</FormLabel>
                <FormControl><Input placeholder="https://placehold.co/600x400.png or data:image/..." {...field} /></FormControl>
                <FormDescription>Provide a URL or upload a file above for the main image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataAiHint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Image AI Hint (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g., dell laptop" {...field} /></FormControl>
                <FormDescription>One or two keywords for AI image search (max 2 words) for the main image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Additional Product Images</h3>
             <FormItem>
                <FormLabel>Upload Additional Images (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleAdditionalImagesFileChange} 
                      className="flex-1"
                      disabled={additionalImages.length >= MAX_ADDITIONAL_IMAGES}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Max {MAX_ADDITIONAL_IMAGE_SIZE_MB}MB per image. Up to {MAX_ADDITIONAL_IMAGES} additional images. 
                  Currently: {additionalImages.length}/{MAX_ADDITIONAL_IMAGES}.
                </FormDescription>
              </FormItem>

            {additionalImages.length > 0 && (
                <div className="mt-4 space-y-3">
                    <FormLabel>Additional Image Previews:</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {additionalImages.map((imgSrc, index) => (
                            <div key={index} className="relative group border rounded-md p-1">
                                <Image
                                    src={imgSrc} // This can be a Data URI or an existing URL
                                    alt={`Additional image ${index + 1}`}
                                    width={150}
                                    height={100}
                                    className="rounded-md object-cover aspect-[3/2]"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeAdditionalImage(index)}
                                    aria-label={`Remove additional image ${index + 1}`}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="flex space-x-6 pt-4">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>Display this product in the featured section on the homepage.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newArrival"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>New Arrival</FormLabel>
                    <FormDescription>Mark this product as a new arrival.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {laptopToEdit ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
    