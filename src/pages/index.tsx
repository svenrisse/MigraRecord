import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data } = useSession();
  const router = useRouter();

  if (data) {
    () => void router.push("/dashboard");
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <h1 className="py-8 text-xl font-bold">Migraine-Tracker</h1>
          <p>Please sign in to continue!</p>
          <div className="py-4">
            <button
              className="rounded-xl bg-emerald-200 px-6 py-3 text-lg font-bold"
              onClick={() => void signIn()}
            >
              Signin
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
