import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-arsenal-red">404</h1>
      <p className="text-xl mt-4 text-surface-600 dark:text-surface-400">
        Player not found
      </p>
      <p className="text-sm mt-2 text-surface-500">
        This player may not be in our database yet.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-6 py-3 rounded-xl bg-arsenal-red text-white font-semibold text-sm hover:bg-arsenal-dark transition-colors"
      >
        Back to all players
      </Link>
    </div>
  );
}
