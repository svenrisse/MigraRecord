
import type { questionInputs as Inputs } from "~/types/types";
import { questionFormSchema as questionSchema } from "~/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { string, coerce, object } from "zod";
import type { z } from "zod";

export const questionSchema = object({
  name: string(),
  amount: string(),
  date: coerce.date(),
});

export type Inputs = z.infer<typeof questionSchema>;

export default function MedicationModal({
  medicationOptions,
  id,
  eventMedications,
}: {
  medicationOptions: JSX.Element[] | undefined;
  id: string;
  eventMedications: JSX.Element[] | undefined;
}) {
  const utils = api.useContext();
  const { reset, register, handleSubmit } = useForm<Inputs>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    console.log(parseFloat(data.amount));
    mutateAsync({
      id: id,
      amount: parseFloat(data.amount),
      name: data.name,
      time: data.date,
    });
  };

  const { mutateAsync, isLoading } =
    api.eventMedication.addEventMedication.useMutation({
      onSuccess() {
        utils.event.invalidate();
        reset();
      },
    });

  return (
    <div>
      <div className="mb-3 flex flex-col items-center gap-1">
        {eventMedications}
      </div>
      <div className="divider"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 pt-4 font-sans"
      >
        <div className="flex flex-col items-center gap-4">
          <select
            {...register("name")}
            name="name"
            required
            className="select-primary select select-sm w-min"
          >
            {medicationOptions}
          </select>
          <div className="flex font-bold">
            <input
              {...register("amount")}
              type="number"
              step={"0.1"}
              defaultValue={0}
              min={1}
              max={20}
              className="input-primary input h-10 w-10 p-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <input
            type="datetime-local"
            {...register("date")}
            className="input-bordered input-primary input input-sm max-w-xs font-semibold"
            required
          />
          <button
            type="submit"
            className="btn-primary btn font-bold text-white"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <div>Add</div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
