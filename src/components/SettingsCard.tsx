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
      <div className="flex w-10/12 items-center rounded-lg bg-gray-50 px-2 py-2 text-sm">
        <div>{content}</div>
        <BsFillTrashFill
          className="ml-auto"
          onClick={() => handleDeleteClick(id)}
        />
      </div>
    </>
  );
}
