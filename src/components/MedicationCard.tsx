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
    <div className="flex w-11/12 items-center gap-3 rounded-xl border border-secondary bg-base-100 px-2 py-1 font-semibold text-base-200">
      <div className="flex w-1/2 items-center justify-start">
        <div className="w-4 text-center text-sm">{medication.amount} </div>
        <span className="w-4 text-center text-sm text-gray-600">x</span>

        <div className="w-20 pl-1 text-center text-xs">{medication.name}</div>
      </div>
      <div className="divider divider-horizontal"></div>
      <div className="flex w-1/2 items-center gap-1 pl-1">
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
