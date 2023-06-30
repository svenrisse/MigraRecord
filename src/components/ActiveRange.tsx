export default function ActiveRange({
  activeRange,
  setActiveRange,
}: {
  activeRange: { all: boolean; range: number };
  setActiveRange: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <>
      <div className="mt-6 flex gap-4 rounded-xl bg-gray-50 px-2 py-2">
        <button
          className={`${
            activeRange.range === 1 && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => setActiveRange({ all: false, range: 1 })}
        >
          1M
        </button>

        <button
          className={`${
            activeRange.range === 3 && "bg-cyan-600 text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => setActiveRange({ all: false, range: 3 })}
        >
          3M
        </button>
        <button
          className={`${
            activeRange.range === 6 && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => setActiveRange({ all: false, range: 6 })}
        >
          6M
        </button>
        <button
          className={`${
            activeRange.all === true && "bg-cyan-600  text-white"
          } rounded-xl  border-2 border-cyan-600 px-4 py-2 font-bold`}
          onClick={() => setActiveRange({ all: true, range: 0 })}
        >
          All
        </button>
      </div>
    </>
  );
}
