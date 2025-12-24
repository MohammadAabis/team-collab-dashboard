import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { setupAxiosInterceptors } from "./api/axiosClient";
// import { useEffect } from "react";

import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // const auth = useAuth();

  // useEffect(() => {
  //   setupAxiosInterceptors(auth);
  // }, [auth]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
