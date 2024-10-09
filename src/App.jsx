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
import BreakManagement from "./features/breakManagement/BreakManagement";
import GeneralRequest from "./features/generalRequest/GeneralRequest";
import CustomerRequest from "./features/customerRequest/CustomerRequest";

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
                <UserConfiguration />
              </ProtectedPage>
            }
          />
          <Route
            path="/layout/break_management"
            element={
              <ProtectedPage>
                <BreakManagement />
              </ProtectedPage>
            }
          />
          <Route
            path="/layout/general_Request"
            element={
              <ProtectedPage>
                <GeneralRequest />
              </ProtectedPage>
            }
          />
          <Route
            path="/layout/customer_request"
            element={
              <ProtectedPage>
                <CustomerRequest />
              </ProtectedPage>
            }
          />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
