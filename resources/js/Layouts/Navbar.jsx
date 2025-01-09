import { Link } from "@inertiajs/react";
export default function Navbar({ children }) {
    return (
        <>
            <nav className="p-4 bg-gray-800">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <Link href="/" className="text-2xl font-bold">
                        <span className="text-white">Round</span>
                        <span className="text-blue-400">est</span>
                    </Link>
                    <Link
                        href="/pokemon"
                        className="text-white transition-colors duration-300 hover:text-blue-400"
                    >
                        View Rankings
                    </Link>
                </div>
            </nav>
            <main className="bg-gray-900">{children}</main>
        </>
    );
}
