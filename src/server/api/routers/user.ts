import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Questions: true,
        Medication: true,
      },
    });
  }),
  addQuestion: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          text: input.text,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
  addMedication: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.medication.create({
        data: {
          text: input.text,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  deleteMedication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.medication.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
