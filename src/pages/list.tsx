import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import EventCard from "~/components/EventCard";
import { useState } from "react";
import ActiveRange from "~/components/ActiveRange";
import { TailSpin } from "react-loader-spinner";
import { subMonths } from "date-fns";
import { useTheme } from "next-themes";

export interface Limit {
  limit: Date;
}

export default function List() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [activeRange, setActiveRange] = useState<Limit>({
    limit: subMonths(new Date(), 1),
  });

  const { data, isInitialLoading } = api.event.listEventsInRange.useQuery({
    limit: activeRange.limit,
  });

  const events = data?.map((event) => {
    return (
      <>
        <EventCard key={event.id} event={event} />
      </>
    );
  });

  return (
    <>
      <main
        className={`${
          theme === "customlight"
            ? "bg-[url('/blob-scene-white.svg')]"
            : "bg-[url('/blob-scene.svg')]"
        } flex min-h-screen flex-col items-center justify-center`}
      >
        <div className="absolute top-0">
          <ActiveRange setActiveRange={setActiveRange} />
        </div>
        {isInitialLoading ? (
          <div className="rounded-lg bg-slate-200 px-8 py-6">
            <TailSpin color="cyan" />
            <p className="">Loading...</p>
          </div>
        ) : (
          <div className="flex w-9/12 flex-col gap-3 pb-20 pt-32">{events}</div>
        )}
      </main>
      <Navbar focused="list" />
    </>
  );
}
