import Navbar from "../components/Navbar";
import SettingsCard from "~/components/SettingsCard";
import { useState } from "react";
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

  function toggleTheme() {
    setTheme(theme === "customdark" ? "customlight" : "customdark");
  }

  return (
    <>
      <main
        className={`${
          theme === "customlight"
            ? "bg-[url('/blob-scene-white.svg')]"
            : "bg-[url('/blob-scene.svg')]"
        } flex min-h-screen flex-col items-center justify-center bg-fixed`}
      >
        <div className="flex w-11/12 flex-col items-center gap-5">
          <button
            className="btn-primary btn w-36 font-bold text-white"
            onClick={() => {
              setModalContent("medications");
              if (window) {
                (
                  document.getElementById("my_modal_2") as HTMLFormElement
                ).showModal();
              }
            }}
          >
            Edit Medications
          </button>
          <button
            className="btn-primary btn w-36 font-bold text-white"
            onClick={() => {
              setModalContent("questions");
              if (window) {
                (
                  document.getElementById("my_modal_2") as HTMLFormElement
                ).showModal();
              }
            }}
          >
            Edit Questions
          </button>
          <button className="btn-primary btn w-36" onClick={toggleTheme}>
            {theme === "customdark" ? (
              <svg
                className="h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            ) : (
              <svg
                className="h-10 w-10 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
            )}
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
          <form method="dialog" className="modal-box bg-base-100">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                {modalContent === "questions" ? (
                  <div className="flex flex-col items-center gap-4">
                    {userQuestions}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    {userMedications}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 px-2">
                <input
                  type="text"
                  className="input-bordered input-primary input w-10/12 bg-base-100 text-base-200"
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
