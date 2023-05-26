export default function SettingsCard({ content }: { content: string }) {
  return (
    <>
      <div className="w-10/12 rounded-lg bg-gray-50 px-2 py-2 text-sm">
        {content}
      </div>
    </>
  );
}
