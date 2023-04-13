import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eventSchema } from "~/pages/addevent";

export const eventRouter = createTRPCRouter({
  addEvent: protectedProcedure.input(eventSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.event.upsert({
      where: {
        id: input.id,
      },
      update: {
        questions: input.questions,
        type: input.type,
        notes: input.note,
        painScale: input.pain,
        medications: input.medications,
        completed: input.completed,
        startTime: input.startTime,
        endTime: input.endTime,
      },
      create: {
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
        questions: input.questions,
        type: input.type,
        notes: input.note,
        painScale: input.pain,
        medications: input.medications,
        completed: input.completed,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }),
  listEvents: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: [{ startTime: "desc" }],
    });
  }),
});
