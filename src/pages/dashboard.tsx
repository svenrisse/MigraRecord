import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import EventCard from "~/components/EventCard";
import { api } from "../utils/api";
import { TailSpin } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import {
  subMonths,
  differenceInMinutes,
  intervalToDuration,
  formatDuration,
} from "date-fns";
import { format } from "date-fns";
import { createId } from "@paralleldrive/cuid2";
import { useReactToPrint } from "react-to-print";
import { AiFillPrinter } from "react-icons/ai";
import { coerce, object } from "zod";
import type { z } from "zod";

export const dashboardSchema = object({
  endDate: coerce.date(),
});

export type Inputs = z.infer<typeof dashboardSchema>;

export default function Dashboard() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [dates, setDates] = useState<Inputs>({
    endDate: new Date(),
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { data, isFetching } = api.event.getEventDashboard.useQuery(
    {
      start: subMonths(dates.endDate, 3),
      end: dates.endDate,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { register, handleSubmit, control } = useForm<Inputs>({
    resolver: zodResolver(dashboardSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setDates({
      endDate: data.endDate,
    });
  };

  const count: { [key: string]: number } = {};
  data?.forEach((event) => {
    const temp = format(event.startTime, "LLLL");
    count[temp] = count[temp] ? count[temp]! + 1 : 1;
  });

  const avgPain: { [key: string]: number } = {};
  const totalDuration: { [key: string]: number | string } = {};
  const avgDuration: { [key: string]: number | string } = {};
  const migraineAmount: { [key: string]: number } = {};
  const tensionAmount: { [key: string]: number } = {};
  const otherAmount: { [key: string]: number } = {};

  function calcMedAmount() {
    data?.forEach((event) => {
      const temp = format(event.startTime, "LLLL");
      if (event.medications) {
        switch (event.type) {
          case "Migraine":
            migraineAmount[temp] = migraineAmount[temp]
              ? migraineAmount[temp]! + 1
              : 1;
            break;
          case "Tension":
            tensionAmount[temp] = tensionAmount[temp]
              ? tensionAmount[temp]! + 1
              : 1;
            break;
          case "Other":
            otherAmount[temp] = otherAmount[temp] ? otherAmount[temp]! + 1 : 1;
            break;
        }
      }
    });
  }

  function calcPain() {
    data?.forEach((event) => {
      const temp = format(event.startTime, "LLLL");
      if (event.painScale) {
        avgPain[temp] = avgPain[temp]
          ? avgPain[temp]! + event.painScale
          : event.painScale;
      }
    });

    for (const month in avgPain) {
      avgPain[month] = avgPain[month]! / count[month]!;
    }
  }

  function calcDuration() {
    data?.forEach((event) => {
      if (event.endTime) {
        const difference = differenceInMinutes(event.endTime, event.startTime);
        const temp = format(event.startTime, "LLLL");
        totalDuration[temp] = totalDuration[temp]
          ? (totalDuration[temp]! as number) + difference
          : difference;
      }
    });

    for (const month in totalDuration) {
      avgDuration[month] = (totalDuration[month]! as number) / count[month]!;
      avgDuration[month] = formatDuration(
        intervalToDuration({
          start: 0,
          end: (avgDuration[month] as number) * 60000,
        }),
        { format: ["days", "hours", "minutes"] }
      )
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d");
      totalDuration[month] = formatDuration(
        intervalToDuration({
          start: 0,
          end: (totalDuration[month] as number) * 60000,
        })
      )
        .replace(" minutes", "m")
        .replace(" minute", "m")
        .replace(" hours", "h")
        .replace(" hour", "h")
        .replace(" days", "d")
        .replace(" day", "d");
    }
  }

  calcPain();
  calcDuration();
  calcMedAmount();

  const timeData = Object.keys(totalDuration).map((month) => {
    return (
      <div className="stat place-items-center" key={createId()}>
        <div className="stat-title">{month}</div>
        <div className="stat-value text-sm">{totalDuration[month]}</div>
        <div className="stat-desc">avg: {avgDuration[month]}</div>
      </div>
    );
  });

  const countData = Object.keys(count).map((month) => {
    return (
      <div className="stat place-items-center" key={createId()}>
        <div className="stat-title">{month}</div>
        <div className="stat-value text-xl">{count[month]}</div>
        <div className="stat-desc">
          {migraineAmount[month] ? migraineAmount[month] : 0} /{" "}
          {tensionAmount[month] ? tensionAmount[month] : 0} /{" "}
          {otherAmount[month] ? otherAmount[month] : 0}
        </div>
      </div>
    );
  });

  const painData = Object.keys(avgPain).map((month) => {
    return (
      <div className="stat place-items-center" key={createId()}>
        <div className="stat-title">{month}</div>
        <div className="stat-value text-xl">
          {avgPain[month]?.toPrecision(2)}
        </div>
      </div>
    );
  });

  const events = data?.map((event) => {
    return (
      <>
        <EventCard key={event.id} event={event} />
      </>
    );
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490] py-8">
        <div className="rounded-xl bg-white p-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <div className="flex gap-4">
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
              {isFetching ? (
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
        <button
          className="btn-success btn absolute right-4 top-10"
          onClick={handlePrint}
        >
          <AiFillPrinter size={"2rem"} />
        </button>
        {isFetching ? (
          <div className="rounded-lg bg-slate-200 px-8 py-6">
            <TailSpin color="cyan" />
            <p className="">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center" ref={componentRef}>
            <div className="mt-12 flex flex-col gap-2">
              <div className="rounded-xl bg-white px-1 py-2 text-lg">
                <div className="flex items-center">
                  <h3 className="p-1 font-bold">Amount</h3>
                  <h4 className="ml-auto px-4 text-xs text-gray-500">
                    Migraine / Tension / Other
                  </h4>
                </div>
                <div className="stats min-w-full border shadow">
                  {countData}
                </div>
              </div>
              <div className="rounded-xl bg-white px-1 py-2 text-lg">
                <h3 className="p-1 font-bold">Duration</h3>
                <div className="stats min-w-full border shadow">{timeData}</div>
              </div>

              <div className="rounded-xl bg-white px-1 py-2 text-lg">
                <h3 className="p-1 font-bold">Avg. Pain</h3>
                <div className="stats min-w-full border shadow">{painData}</div>
              </div>
            </div>

            <div className="flex w-9/12 flex-col items-center gap-3 pb-20 pt-8 lg:flex-row lg:flex-wrap">
              {events?.reverse()}
            </div>
          </div>
        )}
      </main>
      <Navbar focused="dashboard" />

      <DevTool control={control} />
    </>
  );
}
