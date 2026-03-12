import { Metadata } from 'next';

export const metadata = {
    title: 'HexaHosting Blog - Latest News and Updates',
    description: 'Stay updated with the latest news, tips, and insights from HexaHosting. Our blog covers everything from Minecraft server hosting to gaming community trends.',
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'operational':
            return 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-400';
        case 'degraded':
            return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-400';
        case 'down':
            return 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400';
        default:
            return 'bg-gray-500/20 border-gray-500/50 text-gray-700 dark:text-gray-400';
    };
};

export default function Blog() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-16 md:p-24">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    HexaHosting Blog
                </h1>
                <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
                    Welcome to the HexaHosting Blog! Here you'll find the latest news, updates, and insights about Minecraft server hosting, gaming trends, and community highlights. Stay tuned for tips, tutorials, and behind-the-scenes looks at how we keep your Minecraft servers running smoothly.
                </p>
                {/* Blog posts would go here */}
            </div>
        </main>
    )
}