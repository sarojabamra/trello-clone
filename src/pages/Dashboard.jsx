import { Plus } from "lucide-react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import BoardList from "../components/boards/BoardList";
import { useBoard } from "../context/BoardContext";

function Dashboard() {
  const { boards, isLoadingBoards, onDeleteBoard, onCreateBoard } = useBoard();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="ui-container py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="ui-eyebrow">Dashboard</p>

            <h1 className="ui-page-title mt-1">Your boards</h1>

            <p className="ui-muted mt-2">
              Organize your projects and keep track of your tasks.
            </p>
          </div>

          <Button variant="primary" onClick={onCreateBoard} className="gap-2">
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
