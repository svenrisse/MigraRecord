import MedicationModal from "./MedicationModal";
import MedicationCard from "./MedicationCard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { TailSpin } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { createId } from "@paralleldrive/cuid2";
import { string, number, array, coerce, object } from "zod";
import type { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

export const eventSchema = object({
  id: string().optional(),
  startTime: coerce.date().or(string()),
  endTime: coerce.date().or(string()).nullish().optional(),
  type: string().nullish(),
  painScale: number().nullish(),
  note: string().nullish(),
  questions: array(string()),
});

export type Inputs = z.infer<typeof eventSchema>;

export default function EventForm({ id }: { id?: string }) {
  const router = useRouter();
  const utils = api.useContext();

  const { data, isInitialLoading } = api.user.getUserData.useQuery();

  const { mutateAsync, isLoading } = api.event.addEvent.useMutation({
    onSuccess: (data) => {
      notify();
      utils.event.invalidate(), utils.user.invalidate();
      router.push(`/edit/${data?.id}`);
    },
  });

  const { data: eventData, isLoading: eventLoading } =
    api.event.getEvent.useQuery(
      {
        id: id ? id : "",
      },
      { refetchOnWindowFocus: false }
    );

  const { register, handleSubmit, setValue, watch } = useForm<Inputs>({
    resolver: zodResolver(eventSchema),
  });

  const watchType = watch("type");
  const watchPain = watch("painScale");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    void mutateAsync({
      id: data.id,
      note: data.note,
      questions: data.questions,
      painScale: data.painScale,
      type: data.type,
      endTime: data.endTime,
      startTime: data.startTime,
    });
  };

  useEffect(() => {
    setValue("id", eventData?.id || "");
    setValue(
      "startTime",
      moment(eventData?.startTime).toISOString(true).slice(0, 16) || ""
    );
    setValue(
      "endTime",
      eventData?.endTime
        ? moment(eventData?.endTime).toISOString(true).slice(0, 16)
        : null
    );
    setValue("type", eventData?.type);
    setValue("painScale", eventData?.painScale || null);
    setValue("questions", eventData?.questions || []);
    setValue("note", eventData?.notes);
  }, [
    setValue,
    eventData?.startTime,
    eventData?.endTime,
    eventData?.id,
    eventData?.questions,
    eventData?.notes,
    eventData?.painScale,
    eventData?.type,
  ]);

  const medicationOptions = data?.Medication.map((medication) => {
    return (
      <option key={medication.id} value={medication.text}>
        {medication.text}
      </option>
    );
  });

  const questionCheckboxes = data?.Questions?.map((question) => {
    return (
      <div className="form-control w-6/12" key={createId()}>
        <label className="label cursor-pointer">
          <span className="label-text">{question.text}</span>
          <input
            type="checkbox"
            value={question.text}
            {...register("questions")}
            className="checkbox-secondary checkbox"
          />
        </label>
      </div>
    );
  });

  const eventMedications = eventData?.medications.map((medication) => {
    return (
      <MedicationCard
        key={medication.id}
        medication={medication}
        id={medication.id}
        showDelete={true}
      />
    );
  });

  const notify = () =>
    toast.custom(
      <div className="toast-center toast toast-top">
        <div className="alert alert-success">
          <span>Saved succesfully</span>
        </div>
      </div>
    );

  if (isInitialLoading || eventLoading) {
    return (
      <div>
        <TailSpin color="cyan" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2 font-sans"
      >
        {!id ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Start Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="input-bordered input-primary input w-full max-w-xs font-semibold"
                  {...register("startTime")}
                  required
                />
              </div>
            </div>
            <button className="btn-primary btn font-bold text-white">
              Save
            </button>
          </div>
        ) : (
          <>
            <div {...register("id")} className="hidden" />

            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Start Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="input-bordered input-primary input w-full max-w-xs font-semibold"
                  {...register("startTime")}
                  required
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">End Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="input-bordered input-primary input w-full max-w-xs font-semibold"
                  {...register("endTime")}
                />
              </div>
            </div>
            <input {...register("type")} className="hidden" />
            <h3 className="text-gray-500">
              What type of headache do you have?
            </h3>

            <div className="flex w-full justify-center gap-3">
              <button
                className={`${
                  watchType == "Migraine" && "bg-cyan-400 font-extrabold"
                }  btn-accent btn w-20 bg-base-100 text-base-200`}
                type="button"
                onClick={() => setValue("type", "Migraine")}
              >
                Migraine
              </button>
              <button
                className={`${
                  watchType == "Tension" && "bg-primary font-extrabold"
                } btn-primary  btn w-20 bg-base-100 text-base-200 `}
                type="button"
                onClick={() => setValue("type", "Tension")}
              >
                Tension
              </button>
              <button
                className={`${
                  watchType == "Other" && "bg-secondary font-extrabold"
                } btn-secondary btn w-20 bg-base-100 text-base-200`}
                type="button"
                onClick={() => setValue("type", "Other")}
              >
                Other
              </button>
            </div>
            <input {...register("painScale")} hidden defaultValue={0} />
            <h3 className="text-gray-500">Rate your pain:</h3>
            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex w-11/12 flex-wrap justify-center gap-2">
                <button
                  className={`${
                    watchPain == 1 && "bg-cyan-100 text-base-300"
                  } btn-outline btn-md btn-circle btn border-cyan-100 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 1)}
                >
                  1
                </button>
                <button
                  className={`${
                    watchPain == 2 && "bg-cyan-200 text-base-300"
                  } btn-outline btn-circle btn border-cyan-200 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 2)}
                >
                  2
                </button>
                <button
                  className={`${
                    watchPain == 3 && "bg-cyan-300 text-base-300"
                  } btn-outline btn-circle btn border-cyan-300 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 3)}
                >
                  3
                </button>
                <button
                  className={`${
                    watchPain == 4 && "bg-cyan-400 text-base-300"
                  } btn-outline btn-circle btn border-cyan-400 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 4)}
                >
                  4
                </button>
                <button
                  className={`${
                    watchPain == 5 && "bg-cyan-500 text-base-300"
                  } btn-outline btn-circle btn border-cyan-500 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 5)}
                >
                  5
                </button>
                <button
                  className={`${
                    watchPain == 6 && "bg-cyan-600 text-white"
                  } btn-outline btn-circle btn border-cyan-600 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 6)}
                >
                  6
                </button>
                <button
                  className={`${
                    watchPain == 7 && "bg-cyan-700 text-white"
                  } btn-outline btn-circle btn border-cyan-700 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 7)}
                >
                  7
                </button>
                <button
                  className={`${
                    watchPain == 8 && "bg-cyan-800 text-white"
                  } btn-outline btn-circle btn border-cyan-800 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 8)}
                >
                  8
                </button>
                <button
                  className={`${
                    watchPain == 9 && "bg-cyan-900 text-white"
                  } btn-outline btn-circle btn border-cyan-900 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 9)}
                >
                  9
                </button>
                <button
                  className={`${
                    watchPain == 10 && "bg-cyan-950 text-white"
                  } btn-outline btn-circle btn border-cyan-950 font-bold`}
                  type="button"
                  onClick={() => setValue("painScale", 10)}
                >
                  10
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <h3 className="my-2 text-gray-500">
                What medications did you use?
              </h3>
              {eventMedications ? (
                <div className="flex flex-col items-center gap-1">
                  {eventMedications}
                </div>
              ) : (
                <span text-sm text-gray-500>
                  None yet
                </span>
              )}
              <button
                className="btn-primary btn-sm btn mt-2 font-bold text-white"
                type="button"
                onClick={() => {
                  if (window) {
                    (
                      document.getElementById("my_modal_2") as HTMLFormElement
                    ).showModal();
                  }
                }}
              >
                Edit
              </button>
            </div>
            <div>
              <h3 className="my-1 text-gray-500">
                Please click on the applying questions:
              </h3>
              {data?.Medication && data.Medication.length > 0 ? (
                <div className="flex flex-col items-center gap-1">
                  {questionCheckboxes}
                </div>
              ) : (
                <span className="flex items-center justify-center font-light text-gray-400">
                  No Questions added yet
                </span>
              )}
            </div>

            <textarea
              className="textarea-primary textarea"
              placeholder="Note"
              {...register("note")}
            />

            <button
              type="submit"
              className="btn-primary btn my-2 font-bold text-white"
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <div>Save</div>
              )}
            </button>
          </>
        )}
      </form>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <MedicationModal
            medicationOptions={medicationOptions}
            id={typeof id !== undefined ? (id as string) : ""}
            eventMedications={eventMedications}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <Toaster />
    </>
  );
}
