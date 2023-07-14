import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, coerce } from "zod";
import type { z } from "zod";
import type { SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { api } from "~/utils/api";

export const questionSchema = object({
  name: string(),
  amount: string(),
  date: coerce.date(),
});

type Inputs = z.infer<typeof questionSchema>;

export default function MedicationModal({
  modalIsOpen,
  closeModal,
  medicationOptions,
  id,
  eventMedications,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  medicationOptions: JSX.Element[] | undefined;
  id: string;
  eventMedications: JSX.Element[] | undefined;
}) {
  const utils = api.useContext();
  const { control, reset, register, handleSubmit } = useForm<Inputs>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutateAsync({
      id: id,
      amount: parseInt(data.amount),
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
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="fixed inset-x-0 top-1/4 mx-auto w-10/12 rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
      appElement={document.getElementById("__next") as HTMLElement}
    >
      <div className="mb-3 flex flex-col items-center gap-1">
        {eventMedications}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border-t-2 border-gray-400 pt-4 font-sans"
      >
        <div className="flex flex-col items-center gap-4">
          <select
            {...register("name")}
            name="name"
            required
            className="w-min rounded-md border-2 border-cyan-900 bg-white p-1"
          >
            {medicationOptions}
          </select>
          <div className="flex font-bold">
            <input
              {...register("amount")}
              type="number"
              defaultValue={0}
              min={1}
              max={20}
              className="lg w-8 rounded border-2 border-cyan-900 py-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <input
            type="datetime-local"
            {...register("date")}
            className="rounded-md border-2 border-cyan-900 bg-white p-1"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-cyan-600 px-4 py-2 font-bold text-white"
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

      <DevTool control={control} />
    </Modal>
  );
}
