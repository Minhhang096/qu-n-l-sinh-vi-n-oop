"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description,
    itemName,
}: DeleteConfirmDialogProps) {
    const defaultDescription = itemName
        ? `This will permanently delete "${itemName}". This action cannot be undone.`
        : "This action cannot be undone. This will permanently delete the selected item.";

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-2">
                        {description || defaultDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Hook for easier usage
export function useDeleteConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const openDeleteDialog = (item: { id: string; name: string }, onConfirm: () => void) => {
        setItemToDelete(item);
        setOnConfirmCallback(() => onConfirm);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setIsOpen(false);
        setItemToDelete(null);
    };

    const handleClose = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setItemToDelete(null);
            setOnConfirmCallback(null);
        }
    };

    return {
        isOpen,
        itemToDelete,
        openDeleteDialog,
        handleConfirm,
        handleClose,
        DeleteDialog: () => (
            <DeleteConfirmDialog
                open={isOpen}
                onOpenChange={handleClose}
                onConfirm={handleConfirm}
                itemName={itemToDelete?.name}
            />
        ),
    };
}
