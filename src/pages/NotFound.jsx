import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <SearchX size={32} />
        </div>

        <h1 className="mt-6 text-5xl font-bold text-slate-900">404</h1>

        <h2 className="mt-2 text-xl font-semibold text-slate-900">Page not found</h2>

        <p className="mt-2 text-sm text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
