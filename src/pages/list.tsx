import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";

export default function List() {
  const router = useRouter();
  const { data } = useSession();

  if (!data && typeof window !== "undefined") {
    void router.push("/");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div>
          <div>this is the list page</div>
        </div>
      </main>
      <Navbar focused="list" />
    </>
  );
}
