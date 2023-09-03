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
      <div className="mt-6 flex gap-4 rounded-xl px-2 py-2">
        <button
          className={`${
            active === "1" && "border-primary bg-primary text-white"
          } btn-secondary btn w-16 font-extrabold`}
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
            active === "3" && "border-primary bg-primary text-white"
          } btn-secondary btn w-16 font-extrabold`}
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
            active === "6" && "border-primary bg-primary text-white"
          } btn-secondary btn w-16 font-extrabold`}
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
            active === "12" && "border-primary bg-primary text-white"
          } btn-secondary btn w-16 font-extrabold`}
          onClick={() => {
            setActive("12");
            setActiveRange({
              limit: subMonths(new Date(), 12),
            });
          }}
        >
          12M
        </button>
      </div>
    </>
  );
}
