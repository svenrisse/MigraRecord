import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: authData, status } = useSession();
  const router = useRouter();

  if (authData && typeof window !== "undefined") {
    void router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>MigraRecord</title>
        <meta name="description" content="Migraine Tracker by Sven Risse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="hero min-h-screen bg-[url('/blob-scene.svg')]">
        <div className="hero-content text-center">
          <div className="max-w-md text-white">
            <h1 className="text-5xl font-bold">MigraRecord</h1>
            <p className="py-6">Easy and sensible Migraine Tracking</p>
            <button
              className="btn-primary btn text-white"
              onClick={() => void signIn()}
            >
              {status === "loading" ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
