import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./layouts/HomePage";
import LoginPage from "./layouts/LoginPage";
import { Provider } from "react-redux";
import { store } from "./store/store";
import StipePage from "./layouts/StipePage";
import RegisterPage from "./layouts/RegisterPage";
import "./index.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute>
                <StipePage />
              </ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>404: Page not found</div>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
