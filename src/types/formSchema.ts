import { z } from "zod"
export const eventSchema = z.object({
  name: z.string().min(2, {
    message: "Event name is too short"
  }).max(50, {
    message: "Event name is too long, put other details on the 'details' form"
  }),
  type: z.string().min(2, {
    message: "Event type is too short"
  }).max(50, {
    message: "Event type is too long."
  }),
  date: z.date({
    required_error: "Please specify the event date"
  }),
  venue: z.string().min(2, {
    message: "Event venue is too short"
  }).max(50, {
    message: "Event venue is too long"
  }),
  atendee: z.string().min(2, {
    message: "Atendee too long"
  }).max(50, {
    message: "Event venue is too long"
  }),
  notes: z.string().max(1000, {
    message: "Important notes is too long"
  })
})
