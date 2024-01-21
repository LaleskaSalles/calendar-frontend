'use client'
import Events from "./components/events/page";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {

  return (
    <main>
      <Events/>
    </main>
  );
}
