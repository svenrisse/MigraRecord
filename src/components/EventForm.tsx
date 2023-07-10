import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "../utils/api";
import { object, string, array, coerce, number } from "zod";
import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import { useEffect } from "react";
import { DevTool } from "@hookform/devtools";

export const eventSchema = object({
  id: string().optional(),
  startTime: coerce.date().or(string()),
  endTime: coerce.date().nullish().or(string()),
  type: string().nullish(),
  painScale: number().nullish(),
  note: string().nullish(),
  questions: array(string()),
});

type Inputs = z.infer<typeof eventSchema>;

export default function EventForm({ id }: { id?: string }) {
  const router = useRouter();
  const utils = api.useContext();

  const { data, isInitialLoading } = api.user.getUserData.useQuery();

  const { mutateAsync } = api.event.addEvent.useMutation({
    onSuccess: () => {
      utils.event.invalidate(), utils.user.invalidate();
      // router.push(`/edit/${data?.id}`);
    },
  });

  const { data: eventData, isLoading: eventLoading } =
    api.event.getEvent.useQuery({
      id: id ? id : "",
    });

  const { register, handleSubmit, control, setValue, watch } = useForm<Inputs>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    void mutateAsync({
      id: data.id,
      note: data.note,
      questions: data.questions,
      painScale: data.painScale,
      type: data.type,
      endTime: data.endTime,
      startTime: data.startTime,
    });
    console.log(data);
  };

  useEffect(() => {
    setValue("id", eventData?.id || "");
    setValue(
      "startTime",
      eventData?.startTime.toISOString().slice(0, 16) || ""
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

  const watchType = watch("type");
  const watchPain = watch("painScale");
  const watchQuestions = watch("questions");

  const questionCheckboxes = data?.Questions?.map((question) => {
    return (
      <label key={createId()}>
        <input
          type="checkbox"
          value={question.text}
          {...register("questions")}
          className="hidden"
        />
        <div
          className={`${
            watchQuestions &&
            watchQuestions.includes(question.text) &&
            "bg-cyan-900 text-white"
          } cursor-pointer rounded-xl border-2 border-cyan-900 px-2 py-1 text-center`}
        >
          {question.text}
        </div>
      </label>
    );
  });

  if (isInitialLoading || eventLoading) {
    return (
      <div>
        <TailSpin color="cyan" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-2 font-sans"
    >
      {!id ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <div>
            <h4 className="text-center text-gray-500">Enter start time:</h4>
            <input
              type="datetime-local"
              {...register("startTime")}
              className="rounded-md border-2 border-cyan-900 bg-white p-1"
              required
            />
          </div>
          <button className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white">
            Save
          </button>
        </div>
      ) : (
        <>
          <div {...register("id")} className="hidden" />

          <div className="flex flex-col items-center gap-1 pt-1">
            <h4 className="text-gray-500">Start time:</h4>
            <input
              type="datetime-local"
              {...register("startTime")}
              className="rounded-md border-2 border-cyan-900 bg-white p-1"
              required
            />
            <h4 className="text-gray-500">End time:</h4>
            <input
              type="datetime-local"
              {...register("endTime")}
              className="rounded-md border-2 border-cyan-900 bg-white p-1"
            />
          </div>

          <input {...register("type")} className="hidden" />
          <h3 className="text-gray-500">What type of headache do you have?</h3>

          <div className="flex w-full justify-evenly">
            <button
              className={`${
                watchType == "Migraine" && "bg-cyan-600 font-bold text-white"
              } w-20 rounded-xl border-2 border-cyan-600 py-2`}
              type="button"
              onClick={() => setValue("type", "Migraine")}
            >
              Migraine
            </button>
            <button
              className={`${
                watchType == "Tension" && "bg-cyan-600 font-bold text-white"
              } w-20 rounded-xl border-2 border-cyan-600 py-2`}
              type="button"
              onClick={() => setValue("type", "Tension")}
            >
              Tension
            </button>
            <button
              className={`${
                watchType == "Other" && "bg-cyan-600 font-bold text-white"
              } w-20 rounded-xl border-2 border-cyan-600 py-2`}
              type="button"
              onClick={() => setValue("type", "Other")}
            >
              Other
            </button>
          </div>

          <input {...register("painScale")} hidden defaultValue={0} />
          <h3 className="text-gray-500">Rate your pain:</h3>
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex gap-3">
              <button
                className={`${
                  watchPain == 1 && "bg-cyan-100"
                } h-10 w-10 rounded-full border-4 border-cyan-100 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 1)}
              >
                1
              </button>
              <button
                className={`${
                  watchPain == 2 && "bg-cyan-200"
                } h-10 w-10 rounded-full border-4 border-cyan-200 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 2)}
              >
                2
              </button>
              <button
                className={`${
                  watchPain == 3 && "bg-cyan-300"
                } h-10 w-10 rounded-full border-4 border-cyan-300 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 3)}
              >
                3
              </button>
              <button
                className={`${
                  watchPain == 4 && "bg-cyan-400"
                } h-10 w-10 rounded-full border-4 border-cyan-400 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 4)}
              >
                4
              </button>
              <button
                className={`${
                  watchPain == 5 && "bg-cyan-500"
                } h-10 w-10 rounded-full border-4 border-cyan-500 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 5)}
              >
                5
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className={`${
                  watchPain == 6 && "bg-cyan-600"
                } h-10 w-10 rounded-full border-4 border-cyan-600 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 6)}
              >
                6
              </button>
              <button
                className={`${
                  watchPain == 7 && "bg-cyan-700"
                } h-10 w-10 rounded-full border-4 border-cyan-700 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 7)}
              >
                7
              </button>
              <button
                className={`${
                  watchPain == 8 && "bg-cyan-800"
                } h-10 w-10 rounded-full border-4 border-cyan-800 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 8)}
              >
                8
              </button>
              <button
                className={`${
                  watchPain == 9 && "bg-cyan-900"
                } h-10 w-10 rounded-full border-4 border-cyan-900 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 9)}
              >
                9
              </button>
              <button
                className={`${
                  watchPain == 10 && "bg-cyan-950"
                } h-10 w-10 rounded-full border-4 border-cyan-950 font-bold`}
                type="button"
                onClick={() => setValue("painScale", 10)}
              >
                10
              </button>
            </div>
          </div>

          <div>
            <h3 className="my-2 text-gray-500">
              What medications did you use?
            </h3>
            {data?.Medication && data.Medication.length > 0 ? (
              <div className="flex flex-col items-center gap-1">Medis</div>
            ) : (
              <span className="flex items-center justify-center font-light text-gray-400">
                No Medications added yet
              </span>
            )}
          </div>

          <div>
            <h3 className="my-2 text-gray-500">
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

          <h3 className="text-gray-500">Notes:</h3>
          <textarea
            className="rounded-lg border-2 border-cyan-900 p-1"
            {...register("note")}
          />

          <button
            type="submit"
            className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white"
          >
            Save
          </button>
        </>
      )}
      <DevTool control={control} />
    </form>
  );
}
