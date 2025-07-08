import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { id } from "date-fns/locale";

const statusOption = ["Active", "On going", "Transferred to Police", "Closed"] as const;

const formSchema = z.object({
  id: z.number(), 
  type: z.string(), 
  reportedBy: z.string(),
  involved: z.string(), 
  date: z.date(), 
  location: z.string(), 
  zone: z.string(), 
  status: z.enum(statusOption), 
  narrative: z.string(),
  action: z.string(),
  witnesses: z.string(),
  evidence: z.string(),
  resolution: z.string(),
  hearingDate: z.date(),

});

export default function AddBlotterModal() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      type: "",
      reportedBy: "",
      involved: "",
      date: new Date(),
      location: "",
      zone: "",
      status: "Active",   
      narrative: "",
      action: "",
      witnesses: "",
      evidence: "",
      resolution: "",
      hearingDate: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Blotter added successfully", {
      description: `${values.id} ${values.type}`,
    });
    setOpenModal(false);
    invoke("save_blotter", { data: values });
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus /> Add Blotter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto text-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Blotter Information</DialogTitle>
              <DialogDescription>
                All the fields are required unless it is mentioned otherwise
              </DialogDescription>
            </DialogHeader>

            {step === 1 && (
              <>
                <h2 className="text-md font-semibold text-gray-900 mt-2">
                  Blotter Information
                </h2>
                <div className="grid grid-cols-1 gap-4">

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input
                              id="type"
                              type="text"
                              placeholder="Enter first name"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="reportedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reported By</FormLabel>
                          <FormControl>
                            <Input
                              id="reportedBy"
                              type="text"
                              placeholder="Enter middle name"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="involved"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Person Involved</FormLabel>
                          <FormControl>
                            <Input
                              id="involved"
                              type="text"
                              placeholder="Enter middle name"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Incident</FormLabel>
                          <Popover
                            open={openCalendar}
                            onOpenChange={setOpenCalendar}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="center"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barangay</FormLabel>
                          <FormControl>
                            <Input
                              id="location"
                              type="text"
                              placeholder="Enter Barangay/Location"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone</FormLabel>
                          <FormControl>
                            <Input
                              id="zone"
                              type="text"
                              placeholder="Enter Zone/Purok"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-md font-semibold text-gray-900 mt-2">
                  Blotter Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="narrative"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Narrative Report</FormLabel>
                          <FormControl>
                            <Input
                              id="narrative"
                              type="text"
                              placeholder="Enter narrative"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action Taken</FormLabel>
                          <FormControl>
                            <Input
                              id="action"
                              type="text"
                              placeholder="Enter action taken"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="witnesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Witnesses</FormLabel>
                          <FormControl>
                            <Input
                              id="witnesses"
                              type="text"
                              placeholder="Enter witnesses"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="evidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evidence</FormLabel>
                          <FormControl>
                            <Input
                              id="evidence"
                              type="text"
                              placeholder="Enter evidence"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="resolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resolution/Settlement</FormLabel>
                          <FormControl>
                            <Input
                              id="resolution"
                              type="text"
                              placeholder="Enter resolution/settlement"
                              required
                              {...field}
                              className="text-black"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="hearingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Hearing</FormLabel>
                          <Popover
                            open={openCalendar}
                            onOpenChange={setOpenCalendar}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="center"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit">Save Blotter</Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
