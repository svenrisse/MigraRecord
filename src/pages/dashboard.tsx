import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import { useState } from "react";
import ActiveRange from "~/components/ActiveRange";
import { TailSpin } from "react-loader-spinner";

export default function Dashboard() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }
  const [activeRange, setActiveRange] = useState({
    limit: new Date(),
  });

  const { data, isFetching } = api.event.getEventDashboard.useQuery({
    limit: activeRange.limit,
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="absolute top-0">
          <ActiveRange setActiveRange={setActiveRange} />
        </div>
        {isFetching ? (
          <div className="rounded-lg bg-slate-200 px-8 py-6">
            <TailSpin color="cyan" />
            <p className="">Loading...</p>
          </div>
        ) : (
          <div className="flex w-9/12 flex-col gap-3 pb-20 pt-32">
            dashboard
          </div>
        )}
      </main>
      <Navbar focused="dashboard" />
    </>
  );
}
