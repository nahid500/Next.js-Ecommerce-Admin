'use client';

import { SessionProvider, useSession, signIn } from "next-auth/react";
import NavBar from "./components/Navbar";

function AuthGate({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn('google')}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default function SessionWrapper({ children }) {
  return (
    <SessionProvider>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
