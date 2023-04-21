import Navbar from "../components/Navbar";

export default function Calender() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div>
          <div>this is the calender</div>
          <p>more coming soon :)</p>
        </div>
      </main>
      <Navbar focused="calender" />
    </>
  );
}
