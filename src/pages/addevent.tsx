import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import { object, string, array, boolean, coerce, number } from "zod";
import type { z } from "zod";
import { useEffect } from "react";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";

export const eventSchema = object({
  id: string().optional(),
  startTime: coerce.date(),
  endTime: coerce.date().nullish(),
  type: string(),
  pain: number().nullish(),
  medications: array(string()).or(string()),
  note: string(),
  questions: array(string()),
  completed: boolean(),
});

type Inputs = z.infer<typeof eventSchema>;

export default function Addevent() {
  const { register, handleSubmit, setValue, watch } = useForm<Inputs>({
    resolver: zodResolver(eventSchema),
  });
  const watchType = watch("type");
  const watchPain = watch("pain");
  const watchMedications = watch("medications");
  const watchQuestions = watch("questions");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    void mutateAsync({
      id: data.id,
      completed: data.completed,
      note: data.note,
      questions: data.questions,
      medications: data.medications,
      pain: data.pain,
      type: data.type,
      endTime: data.endTime,
      startTime: data.startTime,
    });
  };

  const { data } = api.user.getUserData.useQuery();
  const { mutateAsync } = api.event.addEvent.useMutation({});

  useEffect(() => {
    console.log("useEffect ran");
    setValue("id", "");
    setValue("endTime", null);
    setValue("pain", null);
    setValue("questions", []);
    setValue("medications", []);
  }, [setValue]);

  const medicationCheckboxes = data?.medication?.map((medication: string) => {
    return (
      <label
        key={createId()}
        className={
          watchMedications && watchMedications.includes(medication)
            ? "cursor-pointer bg-yellow-500"
            : "cursor-pointer"
        }
      >
        <input
          type="checkbox"
          value={medication}
          {...register("medications")}
          className="hidden"
        />
        {medication}
      </label>
    );
  });

  const questionCheckboxes = data?.questions?.map((question: string) => {
    return (
      <label
        key={createId()}
        className={
          watchQuestions && watchQuestions.includes(question)
            ? "bg-blue-400"
            : ""
        }
      >
        <input
          type="checkbox"
          value={question}
          {...register("questions")}
          className="hidden"
        />
        {question}
      </label>
    );
  });
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59] pb-16">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <div {...register("id")} className="hidden" />
            <div className="flex flex-col items-center">
              <h4>Start time:</h4>
              <input
                type="datetime-local"
                {...register("startTime")}
                className="rounded-md border-2 border-gray-400 bg-slate-200 p-1"
                required
              />
              <h4>End time:</h4>
              <input type="datetime-local" {...register("endTime")} />
            </div>
            <input {...register("type")} className="hidden" />
            <h3>What type of headache do you have?</h3>
            <div className="flex gap-3">
              <button
                className={watchType == "migraine" ? "bg-red-700" : ""}
                type="button"
                onClick={() => setValue("type", "migraine")}
              >
                Migraine
              </button>
              <button
                className={watchType == "tension" ? "bg-red-700" : ""}
                type="button"
                onClick={() => setValue("type", "tension")}
              >
                Tension Headache
              </button>
              <button
                className={watchType == "other" ? "bg-red-700" : ""}
                type="button"
                onClick={() => setValue("type", "other")}
              >
                Other Headache
              </button>
            </div>

            <input {...register("pain")} hidden defaultValue={0} />
            <h3>Rate your pain:</h3>
            <div className="flex gap-3">
              <button
                className={watchPain == 1 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 1)}
              >
                1
              </button>
              <button
                className={watchPain == 2 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 2)}
              >
                2
              </button>
              <button
                className={watchPain == 3 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 3)}
              >
                3
              </button>
              <button
                className={watchPain == 4 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 4)}
              >
                4
              </button>
              <button
                className={watchPain == 5 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 5)}
              >
                5
              </button>
              <button
                className={watchPain == 6 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 6)}
              >
                6
              </button>
              <button
                className={watchPain == 7 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 7)}
              >
                7
              </button>
              <button
                className={watchPain == 8 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 8)}
              >
                8
              </button>
              <button
                className={watchPain == 9 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 9)}
              >
                9
              </button>
              <button
                className={watchPain == 10 ? "bg-green-600" : ""}
                type="button"
                onClick={() => setValue("pain", 10)}
              >
                10
              </button>
            </div>
            <h3>What medications did you use?</h3>
            <div className="flex gap-3">{medicationCheckboxes}</div>
            <h3>Please click on the applying questions:</h3>
            <div className="flex flex-col gap-2">{questionCheckboxes}</div>
            <textarea {...register("note")} />
            <div className="flex gap-5">
              <button
                type="submit"
                onClick={() => setValue("completed", false)}
              >
                Save
              </button>
              <button type="submit" onClick={() => setValue("completed", true)}>
                Save & Complete
              </button>
            </div>
          </form>
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
