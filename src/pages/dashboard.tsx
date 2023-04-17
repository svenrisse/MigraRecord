import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div>
          <div>this is the dashboard</div>

          <button onClick={() => void signOut()}>Logout</button>
        </div>
      </main>
      <Navbar focused="dashboard" />
    </>
  );
}
