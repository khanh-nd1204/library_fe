import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import LoginPage from "./pages/login/login.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {doGetAccountAction} from "./redux/account/accountSlice.ts";
import {getAccountAPI} from "./services/auth.service.ts";
import {Center, Spinner} from "@chakra-ui/react";
import {ResponseType} from "./types/response.type.ts";
import DashboardPage from "./pages/admin/dashboard.tsx";
import UserPage from "./pages/admin/user.tsx";
import ErrorPage from "./pages/error/error.tsx";
import AdminLayout from "./components/layout/admin.tsx";
import RegisterPage from "./pages/register/register.tsx";
import HomePage from "./pages/home/home.tsx";
import ClientLayout from "./components/layout/client.tsx";
import {UserType} from "./types/user.type.ts";
import PermissionPage from "./pages/admin/permission.tsx";
import RolePage from "./pages/admin/role.tsx";
import CategoryPage from "./pages/admin/category.tsx";
import AuthorPage from "./pages/admin/author.tsx";
import PublisherPage from "./pages/admin/publisher.tsx";
import BookPage from "./pages/admin/book.tsx";
import BorrowPage from "./pages/admin/borrow.tsx";


function App() {
  const dispatch = useDispatch();
  const user: UserType = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const res: ResponseType = await getAccountAPI();
    setLoading(false);
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    } else {
      console.error(res.message);
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ClientLayout children={<Outlet/>}/>,
      errorElement: <ErrorPage/>,
      children: [
        {index: true, element: <HomePage/>},
      ],
    },
    {
      path: "/admin",
      element: !user.id ? <Navigate to="/login" replace/> : user.role !== "ADMIN" ? <ErrorPage/> :
        <AdminLayout children={<Outlet/>}/>,
      errorElement: <ErrorPage/>,
      children: [
        {index: true, element: <DashboardPage/>},
        {path: "user", element: <UserPage/>},
        {path: "permission", element: <PermissionPage/>},
        {path: "role", element: <RolePage/>},
        {path: "category", element: <CategoryPage/>},
        {path: "author", element: <AuthorPage/>},
        {path: "publisher", element: <PublisherPage/>},
        {path: "book", element: <BookPage/>},
        {path: "borrow", element: <BorrowPage/>},
      ],
    },
    {path: "/login", element: user.id ? <Navigate to="/" replace/> : <LoginPage/>},
    {path: "/register", element: user.id ? <Navigate to="/" replace/> : <RegisterPage/>},
  ]);

  return (
    <>
      {loading ? (
        <Center minH={'100vh'}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='teal.600'
            size='xl'
          />
        </Center>
      ) : (
        <RouterProvider router={router}/>
      )}
    </>
  );
}

export default App;
