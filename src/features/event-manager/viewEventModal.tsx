import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/types/formSchema";
import { CalendarIcon, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type ViewProps = {
  name: string,
  type: string,
  status: "Upcoming" | "Finished" | "Ongoing" | "Cancelled",
  date: Date,
  venue: string,
  atendee: string,
  notes: string,
}

const selectOption: string[] = [
  "Seminar",
  "Assembly",
]

export default function ViewEventModal(props: ViewProps) {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: props.name,
      type: props.type,
      date: props.date,
      venue: props.venue,
      atendee: props.atendee,
      notes: props.notes
    }
  })

  function onSubmit(values: z.infer<typeof eventSchema>) {
    console.log(values)
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Eye />
            View More
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((onSubmit))}>
              <DialogHeader>
                <DialogTitle className="text-black">{props.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  All the fields are required unless it is mentioned otherwise
                </DialogDescription>
                <p className="text-md font-bold text-black">Basic Event Information</p>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name" className="text-black font-bold text-xs">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter event name"
                            required
                            {...field}
                            className="text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel htmlFor="type" className="text-black font-bold text-xs">Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full text-black border-black/15">
                              <SelectValue placeholder={"Please select the event type"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectOption.map((option, i) => (
                              <SelectItem value={option} key={i}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="date" className="text-black font-bold text-xs">Date</FormLabel>
                        <Popover>
                          <FormControl>
                            <PopoverTrigger asChild className="w-full text-black hover:bg-primary hover:text-white">
                              <Button
                                variant="outline"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4  hover:text-white" />
                              </Button>
                            </PopoverTrigger>
                          </FormControl>
                          <PopoverContent className="w-auto p-0" align="center">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name" className="text-black font-bold text-xs">Venue</FormLabel>
                        <FormControl>
                          <Input
                            id="venue"
                            type="text"
                            placeholder="Enter Venue Location"
                            required
                            {...field}
                            className="text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="atendee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name" className="text-black font-bold text-xs">Atendee</FormLabel>
                        <FormControl>
                          <Input
                            id="atendee"
                            type="text"
                            placeholder="Enter Atendees"
                            required
                            {...field}
                            className="text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name" className="text-black font-bold text-xs">Important Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Enter important notes"
                            required
                            className="text-black"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>Save Event</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog >
    </>
  )
}
