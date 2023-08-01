import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";
import { useState } from "react";
import ActiveRange from "~/components/ActiveRange";
import { TailSpin } from "react-loader-spinner";
import { subMonths } from "date-fns";

interface ICounts {
  name: string;
  amount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }
  const [activeRange, setActiveRange] = useState({
    limit: subMonths(new Date(), 1),
  });

  const { data, isFetching } = api.event.getEventDashboard.useQuery({
    limit: activeRange.limit,
  });

  const flatMedications: string[] = [];
  data?.medicationCount.map((event) => {
    event.medications.map((medication) => {
      flatMedications.push(medication.name);
    });
  });

  // const medicationCounts: ICounts = {};
  // for (const num of flatMedications) {
  //   medicationCounts[num] = medicationCounts[num]
  //   ? (medicationCounts[num] as number) + 1
  //  : 1;
  //  }

  const flatQuestions: string[] = [];
  data?.questionCount.map((event) => {
    event.questions.map((question) => {
      flatQuestions.push(question);
    });
  });

  //const questionCounts: ICounts = {};
  //for (const num of flatQuestions) {
  // questionCounts[num] = questionCounts[num]
  //  ? (questionCounts[num] as number) + 1
  //  : 1;
  // }

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
          <div className="flex w-9/12 flex-col gap-3 rounded-xl bg-slate-200 py-4 text-center text-sm font-bold">
            Dashboard is coming soon, thank you for your patience :)
          </div>
        )}
      </main>
      <Navbar focused="dashboard" />
    </>
  );
}
