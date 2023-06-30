import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import EventCard from "~/components/EventCard";
import { useState } from "react";

export default function List() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const [activeRange, setActiveRange] = useState("all");

  const { data } = api.event.listEventsInRange.useQuery({
    limit: new Date("2020-01-01"),
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
        <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 px-2 py-2">
          <button
            className={`${
              activeRange == "1" && "bg-cyan-600  text-white"
            } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
            onClick={() => setActiveRange("1")}
          >
            1M
          </button>

          <button
            className={`${
              activeRange == "3" && "bg-cyan-600 text-white"
            } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
            onClick={() => setActiveRange("3")}
          >
            3M
          </button>
          <button
            className={`${
              activeRange == "6" && "bg-cyan-600  text-white"
            } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
            onClick={() => setActiveRange("6")}
          >
            6M
          </button>
          <button
            className={`${
              activeRange == "all" && "bg-cyan-600  text-white"
            } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
            onClick={() => setActiveRange("all")}
          >
            All
          </button>
        </div>
        <div className="flex w-10/12 flex-col gap-3 pb-20 pt-7">{events}</div>
      </main>
      <Navbar focused="list" />
    </>
  );
}
