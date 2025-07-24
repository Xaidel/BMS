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
  type_: z.string().min(2, {
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
  full_name: z.string().min(2, {
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
  household_number: z.number().min(1),
  type_: z.string().min(2, {
    message: "Household type is too short"
  }).max(50, {
    message: "Household type is too long."
  }),
  members: z.number().min(1),
  head: z.string().min(2, {
    message: "Household head name is too short"
  }).max(50, {
    message: "Household head name is too long"
  }),
  zone: z.string().min(2, {
    message: "Zone is too short"
  }).max(50, {
    message: "Zone is too long"
  }),
  date: z.date({
    required_error: "Please specify the registration date"
  }),
  status: z.string().max(1000, {
    message: "Status is too long"
  })
})

export const incomeSchema = z.object({
  type_: z
    .string()
    .min(2, { message: "Type is too short" })
    .max(50, { message: "Type is too long. Add extra details in the remarks." }),

  category: z
    .string()
    .min(1, { message: "Category is required" }),

  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.01, { message: "Amount must be greater than zero" })
    .max(1_000_000, { message: "Amount exceeds maximum allowed value" }),

  or_number: z
    .number({ invalid_type_error: "OR# must be a number" })
    .min(1, { message: "OR# is required" }),

  received_from: z
    .string()
    .min(2, { message: "Received From name is too short" })
    .max(50, { message: "Received From name is too long" }),

  received_by: z
    .string()
    .min(2, { message: "Received By name is too short" })
    .max(50, { message: "Received By name is too long" }),

  date: z.date({
    required_error: "Please specify the date received",
    invalid_type_error: "Invalid date format",
  }),
});

export const expenseSchema = z.object({
  type_: z.string().min(2, {
    message: "Type name is too short",
  }).max(50, {
    message: "Type name is too long, put other details on the 'details' form",
  }),

  category: z.string().min(1, {
    message: "Category is required",
  }),

  amount: z.number({
    invalid_type_error: "Amount must be a number",
  }).min(0.01, {
    message: "Amount must be greater than zero",
  }).max(1_000_000, {
    message: "Amount exceeds maximum allowed value",
  }),

  or_number: z.number({
    invalid_type_error: "OR# must be a number",
  }).min(1, {
    message: "OR# is required",
  }),

  paid_to: z.string().min(2, {
    message: "Paid From name is too short",
  }).max(50, {
    message: "Paid From name is too long",
  }),

  paid_by: z.string().min(2, {
    message: "Paid By name is too short",
  }).max(50, {
    message: "Paid By name is too long",
  }),

  date: z.date({
    required_error: "Please specify the issued date",
    invalid_type_error: "Invalid date format",
  }),
});

export const blotterSchema = z.object({
  type_: z
    .string()
    .min(2, {
      message: "Blotter type is too short",
    })
    .max(50, {
      message: "Blotter type is too long, put other details in the narrative",
    }),
  reported_by: z
    .string()
    .min(2, {
      message: "Reporter name is too short",
    })
    .max(50, {
      message: "Reporter name is too long",
    }),
  involved: z
    .string()
    .min(2, {
      message: "Involved persons description is too short",
    })
    .max(50, {
      message: "Involved persons description is too long",
    }),
  incident_date: z.date({
    required_error: "Please specify the incident date",
  }),
  location: z
    .string()
    .min(2, {
      message: "Location is too short",
    })
    .max(50, {
      message: "Location is too long",
    }),
  zone: z
    .string()
    .min(2, {
      message: "Zone is too short",
    })
    .max(50, {
      message: "Zone is too long",
    }),
  status: z.string().max(1000, {
    message: "Status is too long",
  }),
  narrative: z
    .string()
    .min(2, {
      message: "Narrative is too short",
    })
    .max(1000, {
      message: "Narrative is too long",
    }),
  action: z
    .string()
    .min(2, {
      message: "Action taken is too short",
    })
    .max(1000, {
      message: "Action taken is too long",
    }),
  witnesses: z
    .string()
    .min(2, {
      message: "Witness list is too short",
    })
    .max(1000, {
      message: "Witness list is too long",
    }),
  evidence: z
    .string()
    .min(2, {
      message: "Evidence description is too short",
    })
    .max(1000, {
      message: "Evidence description is too long",
    }),
  resolution: z
    .string()
    .min(2, {
      message: "Resolution is too short",
    })
    .max(1000, {
      message: "Resolution is too long",
    }),
  hearing_date: z.date({
    required_error: "Please specify the hearing date",
  }),
});
