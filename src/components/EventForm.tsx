import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "../utils/api";
import { object, string, array, coerce, number } from "zod";
import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

export const eventSchema = object({
  id: string().optional(),
  startTime: coerce.date().or(string()),
  endTime: coerce.date().nullish().or(string()),
  type: string().nullish(),
  pain: number().nullish(),
  medications: array(string()).or(string()),
  note: string().nullish(),
  questions: array(string()),
});

type Inputs = z.infer<typeof eventSchema>;

export default function EventForm({ id }: { id?: string }) {
  const router = useRouter();

  const { data } = api.user.getUserData.useQuery();
  const { mutateAsync } = api.event.addEvent.useMutation({});
  const { data: eventData } = api.event.getEvent.useQuery({
    id: id ? id : "",
  });

  const { register, handleSubmit, setValue, watch } = useForm<Inputs>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...(eventData
        ? {
            id: eventData?.id,
            startTime: eventData?.startTime.toISOString().slice(0, 16),
            endTime: eventData?.endTime?.toISOString().slice(0, 16),
            type: eventData?.type,
            pain: eventData?.painScale,
            medications: eventData?.medications,
            questions: eventData?.questions,
            note: eventData?.notes,
          }
        : {
            id: "",
            endTime: null,
            pain: null,
            medications: [],
            questions: [],
          }),
    },
  });
  const watchType = watch("type");
  const watchPain = watch("pain");
  const watchMedications = watch("medications");
  const watchQuestions = watch("questions");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    void mutateAsync({
      id: data.id,
      note: data.note,
      questions: data.questions,
      medications: data.medications,
      pain: data.pain,
      type: data.type,
      endTime: data.endTime,
      startTime: data.startTime,
    });
    router.push("/list");
  };

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
          className={watchType == "Migraine" ? "bg-red-700" : ""}
          type="button"
          onClick={() => setValue("type", "Migraine")}
        >
          Migraine
        </button>
        <button
          className={watchType == "Tension Headache" ? "bg-red-700" : ""}
          type="button"
          onClick={() => setValue("type", "Tension Headache")}
        >
          Tension Headache
        </button>
        <button
          className={watchType == "Other Headache" ? "bg-red-700" : ""}
          type="button"
          onClick={() => setValue("type", "Other Headache")}
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
      <button type="submit">Save</button>
    </form>
  );
}
