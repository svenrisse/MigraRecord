import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const eventMedicationRouter = createTRPCRouter({
  addEventMedication: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number(),
        time: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.eventMedication.create({
        data: {
          amount: input.amount,
          name: input.name,
          time: input.time,
          Event: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),
  deleteEventMedication: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.eventMedication.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getEventMedications: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.eventMedication.findMany({
        where: {
          eventId: input.id,
        },
      });
    }),
});
