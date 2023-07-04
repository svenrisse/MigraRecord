import { subMonths } from "date-fns";
import { useState } from "react";
import type { Limit } from "~/pages/list";

export default function ActiveRange({
  setActiveRange,
}: {
  setActiveRange: React.Dispatch<React.SetStateAction<Limit>>;
}) {
  const [active, setActive] = useState("1");
  return (
    <>
      <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 px-2 py-2">
        <button
          className={`${
            active === "1" && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => {
            setActive("1");
            setActiveRange({
              limit: subMonths(new Date(), 1),
            });
          }}
        >
          1M
        </button>

        <button
          className={`${
            active === "3" && "bg-cyan-600 text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => {
            setActive("3");
            setActiveRange({
              limit: subMonths(new Date(), 3),
            });
          }}
        >
          3M
        </button>
        <button
          className={`${
            active === "6" && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => {
            setActive("6");
            setActiveRange({
              limit: subMonths(new Date(), 6),
            });
          }}
        >
          6M
        </button>
        <button
          className={`${
            active === "12" && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => {
            setActive("12");
            setActiveRange({ limit: subMonths(new Date(), 12) });
          }}
        >
          12M
        </button>
      </div>
    </>
  );
}
