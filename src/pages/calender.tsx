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

export default function Calender() {
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

  const { data: selectedData } = api.event.getEventByDate.useQuery({
    startTime: modalContent,
  });

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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-x-0 top-1/4 mx-auto flex w-3/4 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
        appElement={document.getElementById("__next") as HTMLElement}
      >
        <EventCard event={selectedData && selectedData} />
      </Modal>
    </>
  );
}
