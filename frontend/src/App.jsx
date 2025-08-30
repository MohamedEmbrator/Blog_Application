import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import UsersTable from "./pages/admin/UsersTable";
import PostsTable from "./pages/admin/PostsTable";
import Category from "./pages/category/Category";
import ResetPassword from "./pages/forms/ResetPassword";
import Profile from "./pages/profile/Profile";
import PostsPage from "./pages/posts-page/PostsPage";
import PostDetails from "./pages/post-details/PostDetails";
import CategoriesTable from "./pages/admin/CategoriesTable";
import CommentsTable from "./pages/admin/CommentsTable";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import CreatePost from "./pages/create-post/CreatePost";
import ForgotPassword from "./pages/forms/ForgotPassword";
import { useSelector } from "react-redux";
function App() {
  // @ts-ignore
  const { user } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <ToastContainer theme="colored" position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/users/:userId/verify/:token"
          element={!user ? <VerifyEmail /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="posts">
          <Route index element={<PostsPage />} />
          <Route
            path="create-post"
            element={user ? <CreatePost /> : <Navigate to="/" />}
          />
          <Route path="details/:id" element={<PostDetails />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>
        <Route path="admin-dashboard">
          <Route
            index
            element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="users-table"
            element={user?.isAdmin ? <UsersTable /> : <Navigate to="/" />}
          />
          <Route
            path="posts-table"
            element={user?.isAdmin ? <PostsTable /> : <Navigate to="/" />}
          />
          <Route
            path="categories-table"
            element={user?.isAdmin ? <CategoriesTable /> : <Navigate to="/" />}
          />
          <Route
            path="comments-table"
            element={user?.isAdmin ? <CommentsTable /> : <Navigate to="/" />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
