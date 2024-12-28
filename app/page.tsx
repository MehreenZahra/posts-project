import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main >
        {/* <div className="flex gap-4 items-center flex-col sm:flex-row"> */}
        <Button asChild className="mt-2">
        <Link href="/signup">Sign Up</Link>
      </Button>
      <Button asChild className="ml-2 mt-2">
        <Link href="/login">Log In</Link>
      </Button>
        {/* </div> */}
      </main>
    // </div>
  );
}
