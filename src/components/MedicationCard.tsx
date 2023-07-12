export default function MedicationCard({
  medication,
}: {
  medication: {
    name: string;
    amount: number;
    time: Date;
  };
}) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-cyan-900 px-2 py-1">
      <div>
        {medication.amount} <span className="text-sm text-gray-600">x</span>
      </div>
      <div className="text-sm">{medication.name}</div>
      <div className="flex items-center gap-1 border-l-2 border-gray-300 px-2">
        <span className="text-sm text-gray-600">@</span>
        <div>
          {medication.time.toLocaleString().slice(11, 17)}
          <span>, </span>
          {medication.time.toLocaleString().slice(0, 5)}
        </div>
      </div>
    </div>
  );
}
