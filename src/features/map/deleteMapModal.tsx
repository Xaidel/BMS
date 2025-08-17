// src/features/map/DeleteMapModal.tsx
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type DeleteMapModalProps = {
  open: boolean;
  household: {
    id: number;
    name: string;
  } | null;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteMapModal({
  open,
  household,
  onClose,
  onDeleted,
}: DeleteMapModalProps) {
  if (!open || !household) return null;

  async function confirmDelete() {
    try {
      await invoke("delete_household", { id: household.id });
      toast.success(`Household "${household.name}" deleted successfully!`);
      onDeleted();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to delete household: ${error?.toString() || error}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">Delete Household</DialogTitle>
          <DialogDescription className="text-black">
            Are you sure you want to delete household "{household.name}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-black border-gray-200">
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}