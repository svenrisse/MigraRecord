import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "~/components/Navbar";

type Inputs = {
  type: string;
  pain: number;
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

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input {...register("type")} className="hidden" />
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
            <div className="flex">
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
            <button type="submit">Save</button>
          </form>
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
