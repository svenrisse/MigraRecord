export default function PainButton({
  number,
  handleClick,
  disable,
}: {
  number: number;
  handleClick?: React.Dispatch<React.SetStateAction<number>>;
  disable: boolean;
}) {
  const colors = [
    "-cyan-100",
    "-cyan-200",
    "-cyan-300",
    "-cyan-400",
    "-cyan-500",
    "-cyan-600",
    "-cyan-700",
    "-cyan-800",
    "-cyan-900",
    "-cyan-950",
  ];
  return (
    <button
      className={`bg${colors[number - 1]} border${colors[number - 1]} ${
        number > 6 && "text-white"
      } h-10 w-10 rounded-full border-4 font-bold`}
      type="button"
      onClick={() => handleClick && handleClick(1)}
      disabled={disable}
    >
      {number}
    </button>
  );
}
