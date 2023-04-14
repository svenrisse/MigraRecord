import Navbar from "~/components/Navbar";
import Eventform from "~/components/Eventform";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Addevent() {
  const router = useRouter();
  const { data: authData } = useSession();

  if (!authData && typeof window !== "undefined") {
    void router.push("/");
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59] pb-16">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <Eventform />
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
