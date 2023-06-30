export default function ActiveRange({
  activeRange,
  setActiveRange,
}: {
  activeRange: string;
  setActiveRange: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
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
    </>
  );
}
