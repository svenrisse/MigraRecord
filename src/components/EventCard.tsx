import type { RouterOutputs } from "~/utils/api";

export default function EventCard({
  event,
}: {
  event: RouterOutputs["event"]["getEvent"];
}) {
  return (
    <div className="my-2 w-11/12 rounded-md bg-slate-200 p-2 ">
      <div>{event?.startTime.getDate()}</div>
      <div className="flex gap-2">
        <h4>Type:</h4>
        {event?.type ? (
          <div>{event.type}</div>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
      <div className="flex gap-2">
        <h4>Pain:</h4>
        {event?.painScale ? (
          <div>{event.painScale}</div>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
    </div>
  );
}
