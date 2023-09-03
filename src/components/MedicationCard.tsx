import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { BsFillTrashFill } from "react-icons/bs";

export default function MedicationCard({
  medication,
  id,
  showDelete,
}: {
  medication: RouterOutputs["eventMedication"]["getEventMedications"][number];
  id: string;
  showDelete: boolean;
}) {
  const utils = api.useContext();
  const { mutateAsync } = api.eventMedication.deleteEventMedication.useMutation(
    {
      onSuccess() {
        utils.event.invalidate();
      },
    }
  );

  function handleDelete() {
    mutateAsync({
      id: id,
    });
  }
  return (
    <div className="flex w-11/12 items-center justify-center gap-3 rounded-xl border-2 border-cyan-900 bg-secondary px-2 py-1 font-semibold text-white">
      <div className="flex items-center justify-start">
        <div className="w-4 text-center text-sm">{medication.amount} </div>
        <span className="w-4 text-center text-sm text-gray-600">x</span>

        <div className="w-20 pl-1 text-center text-xs">{medication.name}</div>
      </div>
      <div className="flex w-32 items-center gap-1 border-l-2 border-gray-300 pl-1">
        <span className="text-sm text-gray-600">@</span>
        <div className="text-sm">
          {medication.time.toLocaleTimeString().slice(0, 5)}
          <span>, </span>
          {medication.time.toLocaleDateString().slice(0, 5)}
        </div>
      </div>
      {showDelete && (
        <button onClick={handleDelete}>
          <BsFillTrashFill size="1rem" className="cursor-pointer" />
        </button>
      )}
    </div>
  );
}
