import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, coerce, number, z } from "zod";
import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { DevTool } from "@hookform/devtools";
import { api } from "~/utils/api";

export const questionSchema = object({
  name: string(),
  amount: string(),
  date: coerce.date(),
});

type Inputs = z.infer<typeof questionSchema>;

export default function QuestionModal({
  modalIsOpen,
  closeModal,
  medicationOptions,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  medicationOptions: JSX.Element[] | undefined;
}) {
  const [amount, setAmount] = useState(0);
  const { control, register, handleSubmit, setValue } = useForm<Inputs>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  const { mutateAsync } = api.eventMedication.addEventMedication.useMutation()

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="fixed inset-x-0 top-1/2 mx-auto w-10/12 rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
      appElement={document.getElementById("__next") as HTMLElement}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 font-sans"
      >
        <div className="flex flex-col items-center gap-4">
          <select
            {...register("name")}
            name="medications"
            required
            className="w-min rounded-md border-2 border-cyan-900 bg-white p-1"
          >
            {medicationOptions}
          </select>
          <div className="flex font-bold">
            <button
              type="button"
              className="w-8 rounded-l-lg bg-gray-200"
              onClick={() => setAmount(amount + 1)}
            >
              +
            </button>

            <input
              {...register("amount")}
              value={amount}
              type="number"
              defaultValue={0}
              min={1}
              max={20}
              className="w-8 py-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="w-8 rounded-r-lg bg-gray-200"
              onClick={() => setAmount(amount - 1)}
            >
              -
            </button>
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
            Save
          </button>
        </div>
      </form>

      <DevTool control={control} />
    </Modal>
  );
}
