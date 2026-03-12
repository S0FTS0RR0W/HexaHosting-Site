export const metadata = {
  title: "HexaHosting Blog - Latest News and Updates",
  description:
    "Stay updated with the latest news, tips, and insights from HexaHosting. Our blog covers everything from Minecraft server hosting to gaming community trends.",
};

export default function Blog() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-16 md:p-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          HexaHosting Blog
        </h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Welcome to the HexaHosting Blog! Here you'll find the latest news,
          updates, and insights about Minecraft server hosting, gaming trends,
          and community highlights. Stay tuned for tips, tutorials, and
          behind-the-scenes looks at how we keep your Minecraft servers running
          smoothly.
        </p>
        {/* Blog posts would go here */}
      </div>
    </main>
  );
}
