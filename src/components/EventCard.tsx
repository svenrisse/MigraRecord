import type { RouterOutputs } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";

export default function EventCard({
  event,
}: {
  event: RouterOutputs["event"]["getEvent"];
}) {
  const questions = event?.questions.map((question) => {
    return <div key={createId()}>{question}</div>;
  });

  const medications = event?.medications.map((medication) => {
    return <div key={createId()}>{medication}</div>;
  });
  return (
    <div className="rounded-md bg-gray-50 p-2 ">
      <div className="flex gap-1">
        <div>{event?.startTime.toLocaleDateString()}</div>
        <div> - </div>
        <div>
          {event?.endTime ? (
            <div>{event?.endTime?.toLocaleDateString()}</div>
          ) : (
            <div className="text-gray-500">No End Time</div>
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
      <div>
        <h4>Medications:</h4>
        <div>{medications}</div>
      </div>
      <div>
        <h4>Questions answered with yes:</h4>
        <div>{questions}</div>
      </div>
      <div className="flex gap-2">
        <h4>Note:</h4>
        {event?.notes ? (
          <p>{event.notes}</p>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
    </div>
  );
}
