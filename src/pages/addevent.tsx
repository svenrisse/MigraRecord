import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";

type Inputs = {
  startTime: Date;
  endTime: Date;
  type: string;
  pain: number;
  medications: string[];
  note: string;
  questions: string[];
};

export default function Addevent() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const watchType = watch("type");
  const watchPain = watch("pain");
  const watchMedications = watch("medications");
  const watchQuestions = watch("questions");

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const { data: medicationData } = api.user.getMedications.useQuery();
  const { data: questionData } = api.user.getQuestions.useQuery();

  const medicationCheckboxes = medicationData?.map((medication) => {
    return (
      <label
        key={medication.id}
        className={
          watchMedications && watchMedications.includes(medication.name)
            ? "bg-yellow-500"
            : ""
        }
      >
        <input
          type="checkbox"
          value={medication.name}
          {...register("medications")}
          className="hidden"
        />
        {medication.name}
      </label>
    );
  });

  const questionCheckboxes = questionData?.map((question) => {
    return (
      <label
        key={question.id}
        className={
          watchQuestions && watchQuestions.includes(question.text as string)
            ? "bg-blue-400"
            : ""
        }
      >
        <input
          type="checkbox"
          value={question.text as string}
          {...register("questions")}
          className="hidden"
        />
        {question.text}
      </label>
    );
  });
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-col items-center">
              <h4>Start time:</h4>
              <input
                type="datetime-local"
                {...register("startTime")}
                className="rounded-md border-2 border-gray-400 bg-slate-200 p-1"
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

            <input {...register("pain")} className="hidden" />
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
            <div>{questionCheckboxes}</div>
            <button type="submit">Save</button>
          </form>
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
