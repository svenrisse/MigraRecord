import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Navbar from "~/components/Navbar";

type Inputs = {
  type: string;
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
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("type")} className="hidden" />
            <button
              className={watchType == "migraine" ? "bg-red-700" : ""}
              type="button"
              onClick={() => setValue("type", "migraine")}
            >
              Migraine
            </button>

            <input type="submit" />
          </form>
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
