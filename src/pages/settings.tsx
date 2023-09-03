import Navbar from "../components/Navbar";
import SettingsCard from "~/components/SettingsCard";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-modal";
import { string, object } from "zod";
import type { z } from "zod";

export const settingsSchema = object({
  content: string().min(1).max(22),
});

export type Inputs = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { data } = api.user.getUserData.useQuery();

  const { mutateAsync: addQuestion, isLoading: questionIsLoading } =
    api.user.addQuestion.useMutation({
      onSuccess: () => {
        utils.user.getUserData.invalidate();
      },
    });

  const { mutateAsync: deleteQuestion } = api.user.deleteQuestion.useMutation({
    onSuccess: () => {
      utils.user.getUserData.invalidate();
    },
  });

  const { mutateAsync: addMedication, isLoading: medicationIsLoading } =
    api.user.addMedication.useMutation({
      onSuccess: () => {
        utils.user.getUserData.invalidate();
      },
    });

  const { mutateAsync: deleteMedication } =
    api.user.deleteMedication.useMutation({
      onSuccess: () => {
        utils.user.getUserData.invalidate();
      },
    });

  const utils = api.useContext();

  const userQuestions = data?.Questions.map((question) => {
    return (
      <SettingsCard
        key={question.id}
        content={question.text}
        id={question.id}
        handleDeleteClick={handleDeleteClick}
      />
    );
  });

  const userMedications = data?.Medication.map((medication) => {
    return (
      <SettingsCard
        key={medication.id}
        content={medication.text}
        id={medication.id}
        handleDeleteClick={handleDeleteClick}
      />
    );
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const { register, handleSubmit, setValue } = useForm<Inputs>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (modalContent === "questions") {
      addQuestion({ text: data.content });
      setValue("content", "");
      return;
    }
    addMedication({ text: data.content });
    setValue("content", "");
  };

  function handleDeleteClick(id: string) {
    if (modalContent === "questions") {
      deleteQuestion({ id: id });
      return;
    }
    deleteMedication({ id: id });
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="flex w-11/12 flex-col items-center gap-3 rounded-lg bg-gray-50 px-2 py-4">
          <button
            className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white"
            onClick={() => {
              setModalContent("medications");
              openModal();
            }}
          >
            Edit Medications
          </button>
          <button
            className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white"
            onClick={() => {
              setModalContent("questions");
              openModal();
            }}
          >
            Edit Questions
          </button>
          <button
            className="rounded-xl border-2 bg-red-400 px-4 py-2 font-bold text-white"
            onClick={() => void signOut()}
          >
            Logout
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="fixed inset-x-0 top-1/4 mx-auto flex w-3/4 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              {modalContent === "questions" ? (
                <div className="flex flex-col items-center gap-2">
                  {userQuestions}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {userMedications}
                </div>
              )}
            </div>
            <div className="flex h-10 gap-4 px-2">
              <input
                type="text"
                className="w-10/12 rounded-lg text-center"
                placeholder="Add new..."
                {...register("content")}
                min={1}
              ></input>
              <button
                className="w-14 rounded-xl bg-cyan-600 px-4 py-2"
                type="submit"
                disabled={questionIsLoading || medicationIsLoading}
              >
                {medicationIsLoading || questionIsLoading ? (
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
                  <div>+</div>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </main>
      <Navbar focused="settings" />
    </>
  );
}
