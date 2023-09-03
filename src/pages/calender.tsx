import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import Calendar from "react-calendar";
import { eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { api } from "../utils/api";
import type { View } from "react-calendar/dist/cjs/shared/types";
import { useState } from "react";
import EventCard from "~/components/EventCard";

import { useTheme } from "next-themes";
export default function Calender() {
  const { theme } = useTheme();

  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [modalContent, setModalContent] = useState<Date>();

  const { data: selectedData, isLoading: singleEventIsLoading } =
    api.event.getEventByDate.useQuery({
      startTime: modalContent,
    });

  const { data, isLoading: eventsIsLoading } = api.event.listEvents.useQuery();

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
    data?.map((event) => {
      if (
        (event.endTime &&
          isWithinInterval(value, {
            start: event.startTime,
            end: event.endTime,
          })) ||
        isSameDay(value, event.startTime)
      ) {
        setModalContent(event.startTime);
        if (window) {
          (
            document.getElementById("my_modal_2") as HTMLFormElement
          ).showModal();
        }
      }
    });
  }

  return (
    <>
      <main
        className={`${
          theme === "customlight"
            ? "bg-[url('/blob-scene-white.svg')]"
            : "bg-[url('/blob-scene.svg')]"
        } flex min-h-screen flex-col items-center justify-center bg-fixed`}
      >
        <div className="w-11/12 rounded-lg bg-base-100 px-2 py-4 shadow-2xl">
          {eventsIsLoading ? (
            <div className="flex flex-col items-center rounded-lg px-8 py-6 shadow-2xl">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="">Loading...</p>
            </div>
          ) : (
            <Calendar
              tileClassName={tileClassName}
              onClickDay={(value) => handleDayClick(value)}
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
            />
          )}
        </div>
      </main>
      <Navbar focused="calender" />
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          {singleEventIsLoading ? (
            <div className="flex flex-col items-center rounded-lg bg-base-100 px-8 py-6 shadow-2xl">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="">Loading...</p>
            </div>
          ) : (
            <EventCard event={selectedData && selectedData} />
          )}
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
