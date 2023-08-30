import { string, number, array, coerce, object } from "zod";
import type { z } from "zod";

export const dashboardFormSchema = object({
  endDate: coerce.date(),
});

export type dashboardInputs = z.infer<typeof dashboardFormSchema>;

export const eventFormSchema = object({
  id: string().optional(),
  startTime: coerce.date().or(string()),
  endTime: coerce.date().nullish().or(string()),
  type: string().nullish(),
  painScale: number().nullish(),
  note: string().nullish(),
  questions: array(string()),
});

export type eventInputs = z.infer<typeof eventFormSchema>;
