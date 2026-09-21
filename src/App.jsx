import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import CreateBoardModal from "./components/boards/CreateBoardModal";
import { useAuth } from "./context/AuthContext";
import { useBoard } from "./context/BoardContext";
function App() {
  const { user, authLoading, handleLogout } = useAuth();
  const {
    boards,
    isLoadingBoards,
    isCreateBoardModalOpen,
    setIsCreateBoardModalOpen,
    onCreateBoardSubmit,
    onDeleteBoard,
    onCreateBoard,
    onBoardDataRefresh,
  } = useBoard();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={Boolean(user)}
              isLoading={authLoading}
            />
          }
        >
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/board/:boardId"
            element={
              <>
                <Navbar />
                <BoardPage />
              </>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreate={async ({ name, theme }) => {
          await onCreateBoardSubmit({ name, theme });
          setIsCreateBoardModalOpen(false);
        }}
      />
    </BrowserRouter>
  );
}

export default App;
