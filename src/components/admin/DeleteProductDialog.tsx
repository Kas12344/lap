
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleDeleteLaptop } from '@/app/admin/(main_admin_panel)/actions'; // Adjusted import path
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

export default function DeleteProductDialog({ productId, productName }: DeleteProductDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteLaptop(productId);
      toast({
        title: "Success",
        description: `Product "${productName}" deleted successfully.`,
      });
      setIsOpen(false); // Close dialog on success
      router.refresh(); // Refresh page to update product list
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. " + (error instanceof Error ? error.message : String(error)),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Delete product" className="text-destructive hover:text-destructive/80">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product
            <span className="font-semibold"> {productName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" /> }
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
