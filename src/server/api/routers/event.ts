import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { eventSchema } from "~/components/EventForm";
import { z } from "zod";

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
        painScale: input.painScale,
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
        painScale: input.painScale,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }),
  deleteEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.event.delete({
        where: {
          id: input.id,
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
  listEventsInRange: protectedProcedure
    .input(
      z.object({
        limit: z.date().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.event.findMany({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
        },
        include: {
          medications: true,
        },
        orderBy: [{ startTime: "desc" }],
      });
    }),
  getEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          medications: true,
        },
      });
    }),
  getEventByDate: protectedProcedure
    .input(
      z.object({
        startTime: z.date().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (input.startTime) {
        return ctx.prisma.event.findUnique({
          where: {
            startTime: input.startTime,
          },
          include: {
            medications: true,
          },
        });
      }
    }),
  getEventDashboard: protectedProcedure
    .input(z.object({ limit: z.date() }))
    .query(async ({ ctx, input }) => {
      const migraineCount = await ctx.prisma.event.count({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
          type: "Migraine",
        },
      });

      const tensionCount = await ctx.prisma.event.count({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
          type: "Tension",
        },
      });

      const otherCount = await ctx.prisma.event.count({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
          type: "Other",
        },
      });

      const averagePain = await ctx.prisma.event.aggregate({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
        },
        _avg: {
          painScale: true,
        },
      });

      const medicationCount = await ctx.prisma.event.findMany({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
        },
        select: {
          medications: true,
        },
      });

      const questionCount = await ctx.prisma.event.findMany({
        where: {
          userId: ctx.session.user.id,
          startTime: {
            gte: input.limit,
          },
        },
        select: {
          questions: true,
        },
      });

      return {
        migraineCount,
        tensionCount,
        otherCount,
        averagePain,
        medicationCount,
        questionCount,
      };
    }),
});
