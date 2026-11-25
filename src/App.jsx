import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ManageRecipes from "./pages/admin/ManageRecipes";
import Users from "./pages/admin/Users";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/recipes" element={<ManageRecipes />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
import Analytics from "./pages/admin/Analytics";