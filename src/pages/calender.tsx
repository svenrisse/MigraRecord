import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import Calendar from "react-calendar";

export default function Calender() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="w-11/12 rounded-lg bg-slate-200 px-2 py-4">
          <Calendar />
        </div>
      </main>
      <Navbar focused="calender" />
    </>
  );
}
