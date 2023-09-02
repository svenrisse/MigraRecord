import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import Calendar from "react-calendar";
import { eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { api } from "../utils/api";
import type { View } from "react-calendar/dist/cjs/shared/types";
import { useState } from "react";
import Modal from "react-modal";
import EventCard from "~/components/EventCard";
import { TailSpin } from "react-loader-spinner";

import { useTheme } from "next-themes";
export default function Calender() {
  const { theme } = useTheme();

  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [modalContent, setModalContent] = useState<Date>();
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

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
        openModal();
        setModalContent(event.startTime);
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
        } flex min-h-screen flex-col items-center justify-center`}
      >
        <div className="w-11/12 rounded-lg bg-base-100 px-2 py-4">
          {eventsIsLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <TailSpin color="cyan" />
              <p>Loading...</p>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-x-0 top-1/4 mx-auto flex w-3/4 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
      >
        {singleEventIsLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <TailSpin color="cyan" />
            <p>Loading...</p>
          </div>
        ) : (
          <EventCard event={selectedData && selectedData} />
        )}
      </Modal>
    </>
  );
}
