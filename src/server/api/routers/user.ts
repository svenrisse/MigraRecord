import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getMedications: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.medication.findMany({
      where: {
        userId: {
          equals: ctx.session.user.id,
        },
      },
    });
  }),
  getQuestions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
