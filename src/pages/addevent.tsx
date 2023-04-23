import Navbar from "~/components/Navbar";
import EventForm from "~/components/EventForm";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Addevent() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490] pb-16 pt-6">
        <div className="flex w-10/12 flex-col items-center rounded-xl bg-slate-200">
          <EventForm />
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
