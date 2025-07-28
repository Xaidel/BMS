import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, residentSchema } from "@/types/formSchema";
import { CalendarIcon, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";

type ViewPropsResident = {
  id: number;
  prefix: string;
  first_name: string;
  middle_name?: string; // ← Make optional
  last_name: string;
  suffix?: string; // ← Make optional
  civil_status: string;
  gender: string;
  mobile_number: string;
  date_of_birth: Date;
  town_of_birth: string;
  province_of_birth: string;
  nationality: string;
  zone: string;
  barangay: string;
  town: string;
  province: string;
  father_first_name: string;
  father_middle_name: string;
  father_last_name: string;
  father_prefix: string;
  mother_prefix: string;
  mother_first_name: string;
  mother_middle_name: string;
  mother_last_name: string;
  photo?: File | null; // ← Make optional
  status: string;
  onSave: () => void;
};

const selectOption: string[] = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
];

const selectStatus: string[] = ["Moved Out", "Active", "Dead", "Missing"];

export default function ViewResidentModal(props: ViewPropsResident) {
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      ...props,
      date_of_birth: props.date_of_birth
        ? new Date(props.date_of_birth)
        : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof residentSchema>) {
    const residentWithId = {
      ...values,
      id: props.id,
      date_of_birth: values.date_of_birth
        ? typeof values.date_of_birth === "string"
          ? values.date_of_birth
          : values.date_of_birth.toISOString()
        : "",
    };
    await invoke("update_resident_command", { resident: residentWithId });
    toast.success("Resident updated successfully", {
      description: `${values.first_name} ${values.last_name} was updated`,
    });
    setOpenModal(false);
    props.onSave();
  }

  // Helper for field value
  const watch = form.watch;

  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Eye />
            View More
          </Button>
        </DialogTrigger>
        <DialogContent className="text-black bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-black">
                  View More Details
                </DialogTitle>
                <DialogDescription className="text-sm">
                  All the fields are required unless it is mentioned otherwise
                </DialogDescription>
              </DialogHeader>

              {/* Steps navigation */}
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={step === 1 ? "default" : "outline"}
                  onClick={() => setStep(1)}
                  size="sm"
                >
                  Step 1
                </Button>
                <Button
                  type="button"
                  variant={step === 2 ? "default" : "outline"}
                  onClick={() => setStep(2)}
                  size="sm"
                >
                  Step 2
                </Button>
                <Button
                  type="button"
                  variant={step === 3 ? "default" : "outline"}
                  onClick={() => setStep(3)}
                  size="sm"
                >
                  Step 3
                </Button>
              </div>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <>
                  <p className="text-md font-bold text-black">
                    Personal Information
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Prefix */}
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prefix</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("prefix") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("first_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Middle Name */}
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("middle_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("last_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Suffix */}
                    <FormField
                      control={form.control}
                      name="suffix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suffix</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("suffix") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("gender") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Civil Status */}
                    <FormField
                      control={form.control}
                      name="civil_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Civil Status</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("civil_status") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Mobile Number */}
                    <FormField
                      control={form.control}
                      name="mobile_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("mobile_number") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="date_of_birth"
                            className="text-black font-bold text-xs"
                          >
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="date_of_birth"
                              type="date"
                              value={
                                watch("date_of_birth")
                                  ? format(
                                      typeof watch("date_of_birth") === "string"
                                        ? new Date(watch("date_of_birth"))
                                        : watch("date_of_birth"),
                                      "yyyy-MM-dd"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                              className="text-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Address Information */}
              {step === 2 && (
                <>
                  <p className="text-md font-bold text-black">
                    Address Information
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Town of Birth */}
                    <FormField
                      control={form.control}
                      name="town_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town of Birth</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("town_of_birth") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Province of Birth */}
                    <FormField
                      control={form.control}
                      name="province_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province of Birth</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("province_of_birth") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Nationality */}
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("nationality") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Zone */}
                    <FormField
                      control={form.control}
                      name="zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("zone") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Barangay */}
                    <FormField
                      control={form.control}
                      name="barangay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barangay</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("barangay") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Town */}
                    <FormField
                      control={form.control}
                      name="town"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("town") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Province */}
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("province") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("status") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Family Information */}
              {step === 3 && (
                <>
                  <p className="text-md font-bold text-black">
                    Family Information
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Father's Name */}
                    <FormField
                      control={form.control}
                      name="father_prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father Prefix</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("father_prefix") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="father_first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("father_first_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="father_middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father Middle Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("father_middle_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="father_last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("father_last_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Mother's Name */}
                    <FormField
                      control={form.control}
                      name="mother_prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother Prefix</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("mother_prefix") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mother_first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("mother_first_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mother_middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother Middle Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("mother_middle_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mother_last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={watch("mother_last_name") || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step navigation buttons */}
              <div className="flex justify-between mt-4">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div>
                  {step < 3 ? (
                    <Button type="button" onClick={() => setStep(step + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">Save Resident</Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
