import LoginPage from "./pages/LoginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PublicPage from "./router/PublicPage";
import ProtectedPage from "./router/ProtectedPage";
import Layout from "./components/Layout";
import FloorAndRoom from "./pages/FloorAndRoom";
import TaskManagement from "./pages/TaskManagement";
import UserConfiguration from "./pages/UserConfiguration";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route
          path="/login"
          element={
            <PublicPage>
              <LoginPage />
            </PublicPage>
          }
        />
        <Route
          path="/layout"
          element={
            <ProtectedPage>
              <Layout />
            </ProtectedPage>
          }
        >
          <Route
            path="/layout/floorandroom"
            element={
              <ProtectedPage>
                <FloorAndRoom />
              </ProtectedPage>
            }
          />

          <Route
            path="/layout/taskmanagement"
            element={
              <ProtectedPage>
                <TaskManagement />
              </ProtectedPage>
            }
          />
          <Route
            path="/layout/user_management"
            element={
              <ProtectedPage>
                <UserConfiguration/>
              </ProtectedPage>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
