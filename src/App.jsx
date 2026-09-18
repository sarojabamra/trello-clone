import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import CreateBoardModal from "./components/boards/CreateBoardModal";
import {
  createBoard,
  getBoardsByUser,
  deleteBoard,
} from "./services/boardService";
import { auth, googleProvider } from "./firebase/firebase";

const syncUserFromFirebase = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name:
      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    provider: firebaseUser.providerData?.[0]?.providerId || "password",
  };
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(syncUserFromFirebase(currentUser));
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user?.id) {
        setBoards([]);
        return;
      }

      const userBoards = await getBoardsByUser(user.id);
      setBoards(userBoards);
    };

    fetchBoards();
  }, [user?.id]);

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(syncUserFromFirebase(result.user));
    return result.user;
  };

  const handleEmailSignup = async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(result.user, { displayName: name });
    }

    const nextUser = syncUserFromFirebase(result.user);
    setUser(nextUser);
    return result.user;
  };

  const handleEmailLogin = async ({ email, password }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(syncUserFromFirebase(result.user));
    return result.user;
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setBoards([]);
  };

  const handleCreateBoard = async (name) => {
    if (!user?.id) return;

    const newBoard = await createBoard(user.id, { name });
    if (newBoard) {
      setBoards((prev) => [newBoard, ...prev]);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Delete this board? This will also remove its lists and cards.",
    );
    if (!confirmed) return;

    await deleteBoard(user.id, boardId);
    setBoards((prev) => prev.filter((board) => board.id !== boardId));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleGoogleLogin}
              onEmailLogin={handleEmailLogin}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup onLogin={handleGoogleLogin} onSignup={handleEmailSignup} />
          }
        />

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
                <Navbar
                  user={user}
                  onLogout={handleLogout}
                  onCreateBoard={() => setIsCreateBoardModalOpen(true)}
                />
                <Dashboard
                  user={user}
                  onLogout={handleLogout}
                  boards={boards}
                  onDeleteBoard={handleDeleteBoard}
                  onCreateBoard={() => setIsCreateBoardModalOpen(true)}
                />
              </>
            }
          />

          <Route
            path="/board/:boardId"
            element={
              <>
                <Navbar
                  user={user}
                  onLogout={handleLogout}
                  onCreateBoard={() => setIsCreateBoardModalOpen(true)}
                />
                <BoardPage user={user} onLogout={handleLogout} />
              </>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        onCreate={async (name) => {
          await handleCreateBoard(name);
          setIsCreateBoardModalOpen(false);
        }}
      />
    </BrowserRouter>
  );
}

export default App;
