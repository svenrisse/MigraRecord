import { subMonths } from "date-fns";
import { useState } from "react";

export default function ActiveRange({
  setActiveRange,
}: {
  setActiveRange: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [active, setActive] = useState("all");
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
              all: false,
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
              all: false,
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
              all: false,
              limit: subMonths(new Date(), 6),
            });
          }}
        >
          6M
        </button>
        <button
          className={`${
            active === "all" && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => {
            setActive("all");
            setActiveRange({ all: true, limit: new Date() });
          }}
        >
          All
        </button>
      </div>
    </>
  );
}
