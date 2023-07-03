import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import EventCard from "~/components/EventCard";
import { useState } from "react";
import ActiveRange from "~/components/ActiveRange";
import { subMonths } from "date-fns";

export default function List() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [activeRange, setActiveRange] = useState({
    range: 0,
    all: true,
    limit: new Date(),
  });

  // somehow keeps fetching
  const { data } = api.event.listEventsInRange.useQuery({
    all: activeRange.all,
    limit: activeRange.limit,
  });

  const events = data?.map((event) => {
    return (
      <>
        <EventCard event={event} />
      </>
    );
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="min-h-screen">
          <ActiveRange setActiveRange={setActiveRange} />
        </div>
        <div className="flex w-10/12 flex-col items-center justify-center gap-3 pb-20 pt-7">
          {events}
        </div>
      </main>
      <Navbar focused="list" />
    </>
  );
}
