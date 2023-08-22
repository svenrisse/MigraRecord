import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import { TailSpin } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coerce, object } from "zod";
import type { z } from "zod";
import { DevTool } from "@hookform/devtools";
import { subMonths } from "date-fns";

export const dashboardSchema = object({
  startDate: coerce.date(),
  endDate: coerce.date(),
});

type Inputs = z.infer<typeof dashboardSchema>;

export default function Dashboard() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  /* const { data, isFetching } = api.event.getEventDashboard.useQuery({
     limit: activeRange.limit,
   });
 
  const flatMedications: string[] = [];
   data?.medicationCount.map((event) => {
     event.medications.map((medication) => {
       flatMedications.push(medication.name);
     });
   });
 
    const medicationCounts: ICounts = {};
    for (const num of flatMedications) {
      medicationCounts[num] = medicationCounts[num]
      ? (medicationCounts[num] as number) + 1
     : 1;
     }
 
   const flatQuestions: string[] = [];
   data?.questionCount.map((event) => {
     event.questions.map((question) => {
       flatQuestions.push(question);
     });
   });
 
   const questionCounts: ICounts = {};
   for (const num of flatQuestions) {
    questionCounts[num] = questionCounts[num]
     ? (questionCounts[num] as number) + 1
     : 1;
    }
    */

  const { register, handleSubmit, setValue, control } = useForm<Inputs>({
    resolver: zodResolver(dashboardSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="absolute top-12 rounded-xl bg-white p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
            <div className="flex flex-col items-center">
              <input
                type="date"
                required
                {...register("startDate")}
                className="rounded-md border-2 border-cyan-900 bg-white p-1"
                defaultValue={subMonths(new Date(), 1)
                  .toISOString()
                  .substring(0, 10)}
                id="startDate"
              />
              <label htmlFor="startDate" className="text-gray-500">
                Start Date
              </label>
            </div>
            <div className="flex flex-col items-center">
              <input
                type="date"
                required
                {...register("endDate")}
                className="rounded-md border-2 border-cyan-900 bg-white p-1"
                defaultValue={new Date().toISOString().substring(0, 10)}
                id="endDate"
              />
              <label htmlFor="endDate" className="text-gray-500">
                End Date
              </label>
            </div>
          </form>
        </div>
        <div className="rounded-lg bg-slate-200 px-8 py-6">
          <TailSpin color="cyan" />
          <p className="">Loading...</p>
        </div>
        <div className="flex w-9/12 flex-col gap-3 rounded-xl bg-slate-200 py-4 text-center text-sm font-bold">
          Dashboard is coming soon, thank you for your patience :)
        </div>
      </main>
      <Navbar focused="dashboard" />

      <DevTool control={control} />
    </>
  );
}
