import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          About HexaHosting
        </h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          HexaHosting is a specialized Minecraft server hosting company founded
          and run by S0FTS0RR0W. We provide reliable, high-performance hosting
          solutions tailored specifically for Minecraft servers, ensuring your
          gaming experience is seamless and uninterrupted.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            To deliver top-tier Minecraft server hosting that empowers gamers,
            communities, and server owners with lag-free performance, robust
            security, and exceptional support. Whether you're running a small
            private server or a large multiplayer community, HexaHosting has the
            perfect plan for you.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            Why Choose HexaHosting?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">99.9% Uptime</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep your server online and your players happy with guaranteed
                uptime.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">
                High-Performance Hardware
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by SSD storage and optimized for Minecraft for minimal
                lag.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Personalized support from S0FTS0RR0W to help with any server
                needs.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            About the Founder
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            HexaHosting is proudly run by S0FTS0RR0W, a passionate Minecraft
            enthusiast with extensive experience in server administration and
            hosting. With a commitment to quality and customer satisfaction,
            S0FTS0RR0W ensures every server hosted is optimized for the best
            possible experience.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Join thousands of satisfied customers and experience the difference
            with HexaHosting.
          </p>
          <Button size="lg">Start Your Free Trial</Button>
        </section>
      </div>
    </main>
  );
}
