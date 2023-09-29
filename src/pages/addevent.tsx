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
        className={`${theme === "customlight"
            ? "bg-[url('/blob-scene-customlight-phone.svg')] md:bg-[url('/blob-scene-customlight-tablet.svg')] lg:bg-[url('/blob-scene-customlight-laptop.svg')] xl:bg-[url('/blob-scene-customlight-big.svg')] 2xl:bg-[url('/blob-scene-customlight-huge.svg')]"
            : "bg-[url('/blob-scene-customdark-phone.svg')] md:bg-[url('/blob-scene-customdark-tablet.svg')] lg:bg-[url('/blob-scene-customdark-laptop.svg')] xl:bg-[url('/blob-scene-customdark-big.svg')] 2xl:bg-[url('/blob-scene-customdark-huge.svg')]"
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
