// src/App.jsx
import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AuthContextProvider from "./Context/AuthContext"; // Default import here
import MainLayout from "./Components/Layout/MainLayout.jsx";

// Lazy-loaded components
const Login = React.lazy(() => import("./Components/Login/Login.jsx"));
const Signup = React.lazy(() => import("./Components/Signup/Signup.jsx"));
const Pharmacy = React.lazy(() => import("./Components/Pharmacy/Pharmacy.jsx"));
const ForgetPassword = React.lazy(() =>
    import("./Components/ForgetPassword/ForgetPassword.jsx")
);
const CheckYourMail = React.lazy(() =>
    import("./Components/CheckYourMail/CheckYourMail.jsx")
);
const ResetPassword = React.lazy(() =>
    import("./Components/ResetPassword/ResetPassword.jsx")
);
const LandPage = React.lazy(() => import("./Components/LandPage/LandPage.jsx"));
const Home = React.lazy(() => import("./Components/Home/Home.jsx"));
const MyDiagnoses = React.lazy(() =>
    import("./Components/MyDiagnoses/MyDiagnoses.jsx")
);
const PostTreatment = React.lazy(() =>
    import("./Components/PostTreatment/PostTreatment.jsx")
);
const HelpSupport = React.lazy(() =>
    import("./Components/HelpSupport/HelpSupport.jsx")
);
const Settings = React.lazy(() => import("./Components/Settings/Settings.jsx"));
const NotFound = React.lazy(() => import("./Components/NotFound/NotFound.jsx"));

// Router setup with lazy-loaded components
const router = createBrowserRouter([
    // Public routes (without sidebar)
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/forgetpassword",
        element: <ForgetPassword />,
    },
    {
        path: "/checkmail",
        element: <CheckYourMail />,
    },
    {
        path: "/resetpassword",
        element: <ResetPassword />,
    },
    {
        path: "/landpage",
        element: <LandPage />,
    },

    // Protected routes with sidebar, wrapped in AuthContextProvider
    {
        path: "/",
        element: (
            <AuthContextProvider>
                <MainLayout />
            </AuthContextProvider>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "home",
                element: <Home />,
            },
            {
                path: "my-diagnoses",
                element: <MyDiagnoses />,
            },
            {
                path: "pharmacy",
                element: <Pharmacy />,
            },
            {
                path: "post-treatment",
                element: <PostTreatment />,
            },
            {
                path: "help-support",
                element: <HelpSupport />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },

    // 404 page
    {
        path: "*",
        element: <NotFound />,
    },
]);

function App() {
    return (
        <AuthContextProvider>
            <React.Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                    </div>
                }
            >
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                        },
                    }}
                />
                <RouterProvider router={router} />
            </React.Suspense>
        </AuthContextProvider>
    );
}

export default App;
