import { signOut } from "next-auth/react";
import Navbar from "~/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div>
          <div>this is the dashboard</div>

          <button onClick={() => void signOut()}>Logout</button>
        </div>
      </main>
      <Navbar />
    </>
  );
}
