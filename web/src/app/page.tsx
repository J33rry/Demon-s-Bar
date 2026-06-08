import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Link href="/login">
                <button className="border p-2">Login</button>
            </Link>
        </div>
    );
}
