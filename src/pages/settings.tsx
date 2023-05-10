import Navbar from "../components/Navbar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="flex w-11/12 flex-col items-center rounded-lg bg-gray-50 px-2 py-4">
          <button className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white">
            Edit Medications
          </button>
          <button className="rounded-xl border-2 bg-cyan-600 px-4 py-2 font-bold text-white">
            Edit Questions
          </button>
          <button
            className="rounded-xl border-2 bg-red-400 px-4 py-2 font-bold text-white"
            onClick={() => void signOut()}
          >
            Logout
          </button>
        </div>
      </main>
      <Navbar focused="settings" />
    </>
  );
}
