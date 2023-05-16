import Navbar from "../components/Navbar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { useState } from "react";

export default function Settings() {
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
          className="fixed inset-x-0 top-1/2 mx-auto flex w-2/3 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
        >
          <div>{modalContent}</div>
        </Modal>
      </main>
      <Navbar focused="settings" />
    </>
  );
}
