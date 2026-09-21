import { LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";
import trelloIcon from "../../assets/trello-icon.png";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";

function Navbar() {
  const { user, handleLogout } = useAuth();
  const { onCreateBoard } = useBoard();

  const getUserInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="ui-container flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg">
              <img
                src={trelloIcon}
                alt="Trello"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="ps-1 text-xl">Trello Clone</span>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex w-full max-w-3xl items-center gap-2">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search"
                aria-label="Search"
                className=" pl-10!"
              />
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <Button
              type="button"
              onClick={onCreateBoard}
            >
              Create
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="relative hidden items-center gap-2 sm:flex">
              <div
                title={user.name || "User"}
                className="ui-user-avatar group relative"
              >
                {getUserInitials(user.name)}

                <span className="ui-tooltip">
                  {user.name || "User"}
                </span>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="gap-2  sm:px-3"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
