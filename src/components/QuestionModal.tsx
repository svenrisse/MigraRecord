import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, coerce, number, z } from "zod";
import type { SubmitHandler } from "react-hook-form";

export const questionSchema = object({
  name: string(),
  amount: number(),
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
  const { register, handleSubmit, setValue, watch } = useForm<Inputs>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="fixed inset-x-0 top-1/2 mx-auto flex w-2/3 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
      appElement={document.getElementById("__next") as HTMLElement}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2 font-sans"
      >
        <select {...register("name")} name="medications">
          {medicationOptions}
        </select>
        <div>
          <button>+</button>

          <input
            {...register("amount")}
            type="number"
            placeholder="amount"
            defaultValue={0}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button>+</button>
        </div>
        <input
          type="datetime-local"
          {...register("date")}
          className="rounded-md border-2 border-cyan-900 bg-white p-1"
          required
        />
      </form>
    </Modal>
  );
}
