import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

type DeletePinModalProps = {
  pinId: number;
  onDelete: () => void;
  open: boolean;
  onClose: () => void;
};

export default function DeletePinModal({ pinId, onDelete, open, onClose }: DeletePinModalProps) {
  async function onConfirm() {
    try {
      await invoke("delete_pin_command", { id: pinId });
      toast.success("Pin deleted");
      onDelete();
      onClose();
      setTimeout(() => window.location.reload(), 200); // Delay to allow modal to close
    } catch (error) {
      toast.error("Failed to delete pin");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black font-normal">Delete Pin</DialogTitle>
          <DialogDescription className="text-sm font-bold">
            This action cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        <div className="text-black text-lg font-bold">
          Are you sure you want to delete this pin?
        </div>
        <div className="flex w-full gap-3 justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className="text-black">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
