import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./layouts/HomePage";
import LoginPage from "./layouts/LoginPage";
import StipePage from "./layouts/StipePage";
import RegisterPage from "./layouts/RegisterPage";
import "./index.css";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";
import { getMyProfileInfo } from "./store/slices/userSlice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && !profile) {
      dispatch(getMyProfileInfo());
    }
  }, [token, profile, dispatch]);
  return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={
            <StipePage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <HomePage />
            }
          />
          <Route path="*" element={<div>404: Page not found</div>} />
        </Routes>
      </Router>
  );
}

export default App;
