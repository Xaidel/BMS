import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

type Resident = {
  id: number;
  full_name: string;
  civilStatus: string;
  status: "Moved Out" | "Active" | "Dead" | "Missing";
  birthday: Date;
  gender: string;
  zone: string;
};
export default function DeleteResidentModal(resident: Resident) {

  async function onConfirm() {
    try {
      await invoke("delete_resident_command", { id: resident.id });
      toast.success("Resident deleted successfully", {
        description: `${resident.full_name} was deleted`
      });
      window.location.reload(); // Optional: Refresh the page
    } catch (error) {
      toast.error("Failed to delete resident");
      console.error("Delete error:", error);
    }
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <XIcon />
            Delete Resident
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black font-normal">Resident Deletion</DialogTitle>
            <DialogDescription className="text-sm font-bold">This action cannot be undone once confirmed</DialogDescription>
          </DialogHeader>
          <div className="text-black text-lg font-bold">Are you sure you want to delete this resident?</div>
          <div className="flex w-full gap-3 justify-end">
            <DialogClose asChild>
              <Button variant="destructive">Delete</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={onConfirm}>Confirm</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
