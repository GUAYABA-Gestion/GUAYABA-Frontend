"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn("google")}>Login with Google</button>
      ) : (
        <div>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      )}
    </div>
  );
}