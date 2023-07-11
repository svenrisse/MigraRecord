import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "~/server/api/routers/user";
import { eventRouter } from "~/server/api/routers/event";
import { eventMedicationRouter } from "./routers/eventMedication";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  event: eventRouter,
  eventMedication: eventMedicationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
