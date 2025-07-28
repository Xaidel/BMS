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
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      prefix: props.prefix,
      first_name: props.first_name,
      middle_name: props.middle_name,
      last_name: props.last_name,
      suffix: props.suffix,
      civil_status: props.civil_status,
      gender: props.gender,
      mobile_number: props.mobile_number,
      date_of_birth: props.date_of_birth,
      town_of_birth: props.town_of_birth,
      province_of_birth: props.province_of_birth,
      nationality: props.nationality,
      zone: props.zone,
      barangay: props.barangay,
      town: props.town,
      province: props.province,
      father_first_name: props.father_first_name,
      father_middle_name: props.father_middle_name,
      father_last_name: props.father_last_name,
      father_prefix: props.father_prefix,
      mother_prefix: props.mother_prefix,
      mother_first_name: props.mother_first_name,
      mother_middle_name: props.mother_middle_name,
      mother_last_name: props.mother_last_name,
      photo: props.photo,
      status: props.status,
    },
  });

  async function onSubmit(values: z.infer<typeof residentSchema>) {
    const residentWithId = {
      ...values,
      id: props.id,
      date_of_birth: values.date_of_birth
        ? values.date_of_birth.toISOString()
        : "",
    };
    await invoke("save_resident_command", { resident: residentWithId });
    toast.success("Resident updated successfully", {
      description: `${values.first_name} ${values.last_name} was updated`,
    });
    setOpenModal(false);
    props.onSave();
  }
  return (
    <>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Eye />
            View More
          </Button>
        </DialogTrigger>
        <DialogContent>
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

              {step === 1 && (
                <>
                  <h2 className="text-md font-semibold text-gray-900 mt-2">Personal Information</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Prefix */}
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prefix</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                                field.value ? format(field.value, "yyyy-MM-dd") : ""
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
                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {/* Photo Preview (if any) */}
                    {form.watch("photo") && (
                      <div className="col-span-4">
                        {typeof form.watch("photo") === "string" ? (
                          <img
                            src={form.watch("photo") as string}
                            alt="Resident"
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : form.watch("photo") instanceof File ? (
                          <img
                            src={URL.createObjectURL(form.watch("photo") as File)}
                            alt="Resident"
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => setStep(2)}>Next</Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-md font-semibold text-gray-900 mt-2">Place of Birth</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Town of Birth */}
                    <FormField
                      control={form.control}
                      name="town_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Town of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={() => setStep(1)}>Back</Button>
                    <Button type="button" onClick={() => setStep(3)}>Next</Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-md font-semibold text-gray-900 mt-2">Family Information</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {/* Father's Name */}
                    <FormField
                      control={form.control}
                      name="father_prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father Prefix</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={() => setStep(2)}>Back</Button>
                    {props.status === "Active" && (
                      <Button type="submit">Save Resident</Button>
                    )}
                  </div>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
