import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/HexaHosting-Logo.png'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src={logo}
        alt="HexaHosting Logo"
        width={200}
        height={200}
        priority
      />
      <h1 className="text-4xl font-bold">Welcome to HexaHosting!</h1>
      <Link href="/about">
        <Button>Learn More</Button>
      </Link>
    </main>
  )
}