import { api } from "~/utils/api";
import { BsFillTrashFill } from "react-icons/bs";

export default function MedicationCard({
  medication,
  id,
  showDelete,
}: {
  medication: {
    name: string;
    amount: number;
    time: Date;
  };
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
    <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-cyan-900 bg-white px-2 py-1">
      <div>
        {medication.amount} <span className="text-sm text-gray-600">x</span>
      </div>
      <div className="text-sm">{medication.name}</div>
      <div className="flex items-center gap-1 border-l-2 border-gray-300 px-2">
        <span className="text-sm text-gray-600">@</span>
        <div>
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
