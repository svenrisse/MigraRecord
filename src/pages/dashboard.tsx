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
import { getMonth, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { format } from "date-fns";

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

  const [dates, setDates] = useState<Inputs>({
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
  });

  const [monthCounts, setMonthCounts] = useState();

  const { data, isFetching } = api.event.getEventDashboard.useQuery(
    {
      start: dates.startDate,
      end: dates.endDate,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { register, handleSubmit, setValue, control } = useForm<Inputs>({
    resolver: zodResolver(dashboardSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setDates({
      startDate: data.startDate,
      endDate: data.endDate,
    });
  };

  const count: { [key: string]: number } = {};
  data?.forEach((event) => {
    const temp = format(event.startTime, "LLLL");
    console.log(temp);
    count[temp] = count[temp] ? count[temp] + 1 : 1;
  });

  const avgPain: { [key: string]: number } = {};

  function calcPain() {
    data?.forEach((event) => {
      const temp = format(event.startTime, "LLLL");
      if (event.painScale) {
        avgPain[temp] = avgPain[temp]
          ? avgPain[temp] + event.painScale
          : event.painScale;
      }
    });

    for (const month in avgPain) {
      avgPain[month] = avgPain[month] / count[month];
    }

    console.log(count);
    console.log(avgPain);
  }

  calcPain();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="absolute top-12 rounded-xl bg-white p-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <div className="flex gap-4">
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
            </div>
            <button
              type="submit"
              className="mb-1 rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white"
            >
              {!router ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <div>Save</div>
              )}
            </button>
          </form>
        </div>
        {isFetching ? (
          <div className="rounded-lg bg-slate-200 px-8 py-6">
            <TailSpin color="cyan" />
            <p className="">Loading...</p>
          </div>
        ) : (
          <div className="flex w-9/12 flex-col gap-3 rounded-xl bg-slate-200 py-4 text-center text-sm font-bold">
            Dashboard is coming soon, thank you for your patience :)
          </div>
        )}
      </main>
      <Navbar focused="dashboard" />

      <DevTool control={control} />
    </>
  );
}
