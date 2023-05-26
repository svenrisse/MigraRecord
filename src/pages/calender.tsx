import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import Calendar from "react-calendar";
import { eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { api } from "../utils/api";
import type { View } from "react-calendar/dist/cjs/shared/types";

export default function Calender() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const { data } = api.event.listEvents.useQuery();

  const dates = data?.map((event) => {
    return event.endTime
      ? eachDayOfInterval({
          start: event.startTime,
          end: event.endTime,
        })
      : eachDayOfInterval({
          start: event.startTime,
          end: event.startTime,
        });
  });

  const sameDates = dates?.map((datePair) => {
    if (datePair.length === 1) {
      return datePair;
    }
  });

  const lastDates = dates?.map((datePair) => {
    if (datePair.length > 1) {
      return datePair[datePair.length - 1];
    }
  });

  const firstDates = dates?.map((datePair) => {
    return datePair[0];
  });

  function tileClassName({ date, view }: { view: View; date: Date }) {
    if (
      dates &&
      sameDates &&
      view == "month" &&
      sameDates.flat().find((dDate) => isSameDay(dDate as Date, date))
    ) {
      return "bg-cyan-600 rounded-3xl text-white font-bold";
    }

    if (
      dates &&
      lastDates &&
      view == "month" &&
      lastDates.flat().find((dDate) => isSameDay(dDate as Date, date))
    ) {
      return "bg-cyan-600 rounded-r-3xl text-white font-bold";
    }

    if (
      dates &&
      firstDates &&
      view == "month" &&
      firstDates.find((dDate) => isSameDay(dDate as Date, date))
    ) {
      return "bg-cyan-600 rounded-l-3xl text-white font-bold";
    }

    if (
      dates &&
      view === "month" &&
      dates.flat().find((dDate) => isSameDay(dDate, date))
    ) {
      return "bg-cyan-600 text-white font-bold";
    }
  }

  function handleDayClick(value: Date) {
    dates?.map((dates) => {
      if (
        isWithinInterval(value, {
          start: dates[0] as Date,
          end: dates[dates.length - 1] as Date,
        })
      ) {
        console.log(dates[0]);
      }
    });
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="w-11/12 rounded-lg bg-gray-50 px-2 py-4">
          <Calendar
            tileClassName={tileClassName}
            onClickDay={(value) => handleDayClick(value)}
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </main>
      <Navbar focused="calender" />
    </>
  );
}
