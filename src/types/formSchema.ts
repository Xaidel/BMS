import { z } from "zod"

export const loginSchema = z.object({
  name: z.string().min(2, {
    message: "Name is too short"
  }).max(50, {
    message: "Password is too long"
  }),
  password: z.string().min(2, {
    message: "Password is too short"
  }).max(50, {
    message: "Password is too long"
  })
})

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

export const residentSchema = z.object({
  fullName: z.string().min(2, {
    message: "Resident name is too short"
  }).max(50, {
    message: "Resident name is too long, put other details on the 'details' form"
  }),
  civilStatus: z.string().min(2, {
    message: "Resident type is too short"
  }).max(50, {
    message: "Resident type is too long."
  }),
  birthday: z.date({
    required_error: "Please specify the event date"
  }),
  gender: z.string().min(2, {
    message: "Resident venue is too short"
  }).max(50, {
    message: "Resident venue is too long"
  }),
  Zone: z.string().min(2, {
    message: "Resident too long"
  }).max(50, {
    message: "Resident venue is too long"
  }),
  status: z.string().max(1000, {
    message: "Important notes is too long"
  })
})

export const householdSchema = z.object({
  householdNumber: z.string().min(2, {
    message: "Household name is too short"
  }).max(50, {
    message: "Household name is too long, put other details on the 'details' form"
  }),
  type: z.string().min(2, {
    message: "Household type is too short"
  }).max(50, {
    message: "Household type is too long."
  }),
  head: z.string().min(2, {
    message: "Household venue is too short"
  }).max(50, {
    message: "Household venue is too long"
  }),
  zone: z.string().min(2, {
    message: "Atendee too long"
  }).max(50, {
    message: "Household venue is too long"
  }),
  date: z.date({
    required_error: "Please specify the event date"
  }),
  status: z.string().max(1000, {
    message: "Important notes is too long"
  })
})