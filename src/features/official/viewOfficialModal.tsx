import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

type Official = {
  id: number;
  name: string;
  role: string;
  age: number;
  contact: string;
  term_start: string;
  term_end: string;
  zone: string;
  type_: string;
  section: string;
  image?: string;
};

export default function ViewOfficialModal({ person, onClose }) {
  const [officials, setOfficials] = useState([]);
  const [imagePreview, setImagePreview] = useState(person.image || "");

  // Only one useEffect for fetching officials
  useEffect(() => {
    const loadOfficials = async () => {
      try {
        const result = await invoke<Official[]>("fetch_all_officials_command");
        setOfficials(result);
      } catch (error) {
        console.error("Failed to load officials", error);
      }
    };
    loadOfficials();
    // eslint-disable-next-line
  }, []);

  const form = useForm({
    defaultValues: {
      name: person.name || "",
      role: person.role || "",
      type_: person.type_ || "",
      section: person.section || "",
      age: person.info?.age ? String(person.info.age) : "",
      contact: person.info?.contact || "",
      termStart: person.info?.termStart
        ? new Date(person.info.termStart)
        : null,
      termEnd: person.info?.termEnd ? new Date(person.info.termEnd) : null,
      zone: person.info?.zone || "",
      image: person.image || "",
    },
  });

  // For file/image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (values) => {
    try {
      await invoke("save_official_command", {
        official: {
          id: person.id,
          name: values.name,
          role: values.role,
          type_: values.type_,
          section: values.section,
          age: parseInt(values.age) || null,
          contact: values.contact,
          term_start: values.termStart
            ? format(values.termStart, "yyyy-MM-dd")
            : "",
          term_end: values.termEnd ? format(values.termEnd, "yyyy-MM-dd") : "",
          zone: values.zone,
          image: values.image,
        },
      });
      toast.success("Official saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save official");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await invoke("delete_official_command", {
        id: person.id ?? null,
      });
      toast.success("Official deleted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to delete official");
      console.error(error);
    }
  };

  const handleReset = () => {
    form.reset({
      name: "",
      role: "",
      type_: "",
      section: "",
      age: "",
      contact: "",
      termStart: null,
      termEnd: null,
      zone: "",
      image: "",
    });
    setImagePreview("");
  };

  return (
    <>
      <Dialog open={!!person} onOpenChange={onClose}>
        <DialogContent className="text-black" aria-describedby="official-description">
          <DialogHeader>
            <DialogTitle className="text-black">Official Info</DialogTitle>
            <DialogDescription id="official-description">
              View and update the official’s profile information.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="text-center text-black space-y-4"
            >
              <img
                src={imagePreview}
                alt={form.watch("name")}
                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
              />
              <div className="flex justify-center mb-2 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-40 h-10 text-blue-600 bg-blue-600 hover:bg-blue-700"
                />
              </div>
              <div className="space-y-2 text-left">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full Name" className="text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Role</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded text-black"
                        >
                          <option value="">Select Role</option>
                          <option value="Captain">Captain</option>
                          <option value="Councilor">Councilor</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Treasurer">Treasurer</option>
                          <option value="Caretaker">Caretaker</option>
                          <option value="SK Chairman">SK Chairman</option>
                          <option value="SK Kagawad">SK Kagawad</option>
                          <option value="Chief">Chief</option>
                          <option value="Tanod">Tanod</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Age</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Age" className="text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact Number" className="text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="termStart"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Term Start</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (field.value ? "" : "text-muted-foreground")
                                }
                                type="button"
                              >
                                {field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : "Pick date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termEnd"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Term End</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (field.value ? "" : "text-muted-foreground")
                                }
                                type="button"
                              >
                                {field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : "Pick date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Assigned Zone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Assigned Zone" className="text-black" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type_"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded text-black"
                        >
                          <option value="">Select Type</option>
                          <option value="barangay">Barangay</option>
                          <option value="sk">SK</option>
                          <option value="tanod">Tanod</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Section</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded text-black"
                        >
                          <option value="">Select Section</option>
                          <option value="Barangay Officials">Barangay Officials</option>
                          <option value="Barangay Staffs">Barangay Staffs</option>
                          <option value="SK Officials">SK Officials</option>
                          <option value="Tanod Officials">Tanod Officials</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end pt-4 space-x-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="px-4 py-2"
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="px-4 py-2"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="px-4 py-2"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-3 gap-4 p-4">
        {officials.map((official) => (
          <div key={official.id} className="p-4 border rounded shadow">
            <img
              src={official.image}
              alt={official.name}
              className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
            />
            <h2 className="text-lg font-bold text-center">{official.name}</h2>
            <p className="text-center">
              {official.role} - {official.section}
            </p>
            <p className="text-center text-sm text-gray-500">
              {official.type_} • Zone {official.zone}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
