import type { RouterOutputs } from "~/utils/api";

export default function EventCard({
  event,
}: {
  event: RouterOutputs["event"]["getEvent"];
}) {
  return (
    <div className="my-2 rounded-md bg-slate-200 p-2 ">
      <div className="flex gap-1">
        <div>{event?.startTime.toLocaleDateString()}</div>
        <div> - </div>
        <div>
          {event?.endTime ? (
            <div>{event?.endTime?.toLocaleDateString()}</div>
          ) : (
            <div className="text-gray-500">No End Time yet</div>
          )}
        </div>
      </div>
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
      <div className="flex gap-2">
        <h4>Notes:</h4>
        {event?.notes ? (
          <p>{event.notes}</p>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
    </div>
  );
}
