import Navbar from "~/components/Navbar";
import EventForm from "~/components/EventForm";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function Addevent() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }
  return (
    <>
      <main
        className={`${
          theme === "customlight"
            ? "bg-[url('/blob-scene-white.svg')]"
            : "bg-[url('/blob-scene.svg')]"
        } flex min-h-screen flex-col items-center justify-center bg-fixed`}
      >
        <div className="flex w-10/12 flex-col items-center rounded-xl bg-base-100 shadow-2xl">
          <EventForm />
        </div>
      </main>
      <Navbar focused="addevent" />
    </>
  );
}
