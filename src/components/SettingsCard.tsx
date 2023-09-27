import { BsFillTrashFill } from "react-icons/bs";

export default function SettingsCard({
  content,
  id,
  handleDeleteClick,
}: {
  content: string;
  id: string;
  handleDeleteClick(id: string): void;
}) {
  return (
    <>
      <div className="text-md flex w-11/12 items-center rounded-lg bg-primary px-3 py-3 font-bold text-base-100">
        <div>{content}</div>
        <BsFillTrashFill
          className="ml-auto"
          onClick={() => handleDeleteClick(id)}
          size={"1.25rem"}
        />
      </div>
    </>
  );
}
