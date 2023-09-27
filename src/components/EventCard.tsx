import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import Modal from "react-modal";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import MedicationCard from "~/components/MedicationCard";
import PainButton from "./PainButton";
import { intervalToDuration, formatDuration } from "date-fns";

export default function EventCard({
  event,
}: {
  event: RouterOutputs["event"]["getEvent"] | undefined;
}) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const utils = api.useContext();

  const { mutateAsync, isLoading } = api.event.deleteEvent.useMutation({
    onSuccess: () => {
      closeModal(), utils.event.invalidate();
    },
  });

  function handleDeleteClick(id: string, e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    mutateAsync({ id: id });
  }

  const eventQuestions = event?.questions.map((question) => {
    return (
      <div
        className="rounded-lg bg-cyan-900 px-2 py-1 text-sm font-bold text-white "
        key={createId()}
      >
        {question}
      </div>
    );
  });

  const eventMedications = event?.medications.map((medication) => {
    return (
      <MedicationCard
        key={medication.id}
        medication={medication}
        id={medication.id}
        showDelete={false}
      />
    );
  });

  const duration =
    event?.endTime &&
    formatDuration(
      intervalToDuration({
        start: event?.startTime as Date,
        end: event?.endTime as Date,
      }),
      { format: ["days", "hours", "minutes"] }
    )
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" hours", "h")
      .replace(" hour", "h")
      .replace(" days", "d")
      .replace(" day", "d");

  return (
    <>
      <div className="w-full max-w-md rounded-xl bg-base-100 p-2 shadow-2xl">
        <div className="flex items-center justify-center gap-2 font-semibold">
          <div className="flex flex-col items-center rounded-lg border-2 border-secondary px-2 py-1">
            <div>{event?.startTime.toLocaleDateString()}</div>
            <div className="text-sm">
              {event?.startTime.toLocaleTimeString().slice(0, 5)}
            </div>
          </div>
          <div className="font-bold"> - </div>
          <div>
            {event?.endTime ? (
              <div className="flex flex-col items-center rounded-lg border-2 border-secondary px-2 py-1">
                <div>{event?.endTime?.toLocaleDateString()}</div>
                <div className="text-sm">
                  {event.endTime.toLocaleTimeString().slice(0, 5)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-lg border-2 border-secondary px-2 py-1  text-gray-500">
                No End Time
              </div>
            )}
          </div>
        </div>
        <div className="mr-6 flex items-center justify-center gap-4 py-2">
          {event?.type ? (
            <div
              className={`${event.type === "Migraine" && "bg-primary"} ${event.type === "Tension" && "bg-accent text-neutral-900"
                } ${event.type === "Other" && "bg-secondary"
                } rounded-lg px-4 py-1 font-bold text-white`}
            >
              {event.type}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-secondary px-2 py-1 text-gray-500">
              No Type
            </div>
          )}
          {event?.painScale ? (
            <PainButton
              number={event.painScale}
              key={createId()}
              disable={true}
            />
          ) : (
            <div
              className=" flex h-10 w-10 items-center justify-center rounded-full border-4 border-secondary font-bold text-gray-500"
              title="Pain"
            >
              ?
            </div>
          )}
        </div>
        {eventMedications?.length !== 0 && (
          <div className="flex flex-col items-center py-1">
            <div className="flex flex-col items-center gap-1">
              {eventMedications}
            </div>
          </div>
        )}
        {eventQuestions?.length !== 0 && (
          <div className="flex flex-col items-center py-1">
            <div className="flex w-9/12 flex-wrap justify-center gap-1">
              {eventQuestions}
            </div>
          </div>
        )}
        {event?.notes && (
          <div className="flex flex-col items-center py-2">
            <div className="w-8/12 px-1 text-center text-sm">
              <p className="rounded-lg border-2 border-cyan-900">
                {event.notes}
              </p>
            </div>
          </div>
        )}
        <div className="flex px-4 py-2">
          <button onClick={openModal}>
            <BsFillTrashFill
              size={"1.6rem"}
              className="cursor-pointer fill-secondary"
            />
          </button>
          <Link href={`/edit/${event && event.id}`} className="ml-auto">
            <AiFillEdit
              size={"1.7rem"}
              className="cursor-pointer fill-secondary"
            />
          </Link>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="fixed inset-x-0 top-1/2 mx-auto flex w-2/3 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
          appElement={document.getElementById("__next") as HTMLElement}
        >
          <h2 className="mb-5 text-lg font-bold">Are you sure?</h2>
          <div className="flex items-center">
            {!isLoading && (
              <button
                className="mr-5 w-20 rounded-xl bg-cyan-900 py-2 font-bold text-white active:bg-cyan-700"
                onClick={() => closeModal()}
              >
                Cancel
              </button>
            )}
            <button
              className="w-20 rounded-xl bg-red-400 py-2 text-center font-bold text-white active:bg-red-300"
              onClick={(e) =>
                handleDeleteClick(
                  event && typeof event.id === "string" ? event.id : "",
                  e
                )
              }
            >
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <TailSpin height="1.5rem" width="2rem" color="white" />
                ) : (
                  <span>Delete</span>
                )}
              </div>
            </button>
          </div>
        </Modal>
      </div>
      <div className="divider my-1" />
    </>
  );
}
