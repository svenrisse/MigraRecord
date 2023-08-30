import type { settingsInput as Inputs } from "~/types/types";
import { settingsFormSchema as settingsSchema } from "~/types/types";
import Navbar from "../components/Navbar";
import SettingsCard from "~/components/SettingsCard";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
export default function Settings() {
  const { theme, setTheme } = useTheme();
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

  const [modalContent, setModalContent] = useState("");

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-base-100">
        <div className="flex w-11/12 flex-col items-center gap-5">
          <button
            className="btn-primary btn w-36 font-bold text-white"
            onClick={() => {
              setModalContent("medications");
              window.my_modal_2.showModal();
            }}
          >
            Edit Medications
          </button>
          <button
            className="btn-primary btn w-36 font-bold text-white"
            onClick={() => {
              setModalContent("questions");
              window.my_modal_2.showModal();
            }}
          >
            Edit Questions
          </button>
          <button className="btn" onClick={() => setTheme("customlight")}>
            Light Mode
          </button>
          <button className="btn" onClick={() => setTheme("customdark")}>
            Dark Mode
          </button>
          <button
            className="btn-error btn w-36 font-bold text-white"
            onClick={() => void signOut()}
          >
            Logout
          </button>
        </div>
        {/* Open the modal using ID.showModal() method */}
        <dialog id="my_modal_2" className="modal">
          <form method="dialog" className="modal-box bg-background">
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
              <div className="flex items-center gap-4 px-2">
                <input
                  type="text"
                  className="input-bordered input-primary input w-10/12 bg-background"
                  placeholder="Add new..."
                  {...register("content")}
                  min={1}
                ></input>
                <div
                  className="btn-primary btn text-xl text-white"
                  onClick={handleSubmit(onSubmit)}
                >
                  {medicationIsLoading || questionIsLoading ? (
                    <span className="loading loading-spinner loading-lg"></span>
                  ) : (
                    <div>+</div>
                  )}
                </div>
              </div>
            </form>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </main>
      <Navbar focused="settings" />
    </>
  );
}
