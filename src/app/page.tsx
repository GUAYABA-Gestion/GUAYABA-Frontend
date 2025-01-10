"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../../components";

export default function Home() {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Leer el mensaje desde localStorage
    const flashMessage = localStorage.getItem("flashMessage");
    
    if (flashMessage) {
      setMessage(flashMessage);
      // Eliminar el mensaje después de mostrarlo
      localStorage.removeItem("flashMessage");
    }
  }, []);

  return (
    <div>
      <Header />
      <div>
        {message && <div className="alert alert-success">{message}</div>}
      </div>
    </div>
  );
}
