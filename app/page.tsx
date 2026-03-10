import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/Hexa-NoBG.png";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-16 md:p-24">
      <Image
        src={logo}
        alt="HexaHosting Logo"
        width={300}
        height={300}
        priority
        className="w-48 sm:w-64 md:w-80 h-auto"
      />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center">
        Welcome to HexaHosting!
      </h1>
      <Link href="/about">
        <Button className="text-lg px-8 py-6">Learn More</Button>
      </Link>
    </main>
  );
}
