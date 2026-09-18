import { Plus } from "lucide-react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import BoardList from "../components/boards/BoardList";

function Dashboard({ user, boards, onDeleteBoard, onCreateBoard }) {
  const isLoadingBoards = !user?.id && boards.length === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">Dashboard</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Your boards
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Organize your projects and keep track of your tasks.
            </p>
          </div>

          <Button onClick={() => onCreateBoard?.()} className="gap-2">
            <Plus size={18} />
            Create Board
          </Button>
        </div>

        {isLoadingBoards ? (
          <Loader message="Loading your boards..." />
        ) : (
          <BoardList boards={boards} onDeleteBoard={onDeleteBoard} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
