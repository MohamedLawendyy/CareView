import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "sweetalert2"; // Add SweetAlert2 styles
import AuthContextProvider from "./Context/AuthContext";
import MainLayout from "./Components/Layout/MainLayout.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import Doctors from "./Components/DoctorFinder/Doctors.jsx";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy-loaded components
const DoctorSignup = React.lazy(() =>
    import("./Components/Signup/DoctorSignup.jsx")
);
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
const Chats = React.lazy(() =>
    import("./Components/Chats/Chats.jsx")
);
const History = React.lazy(() => import("./Components/History/History.jsx"));
const NotFound = React.lazy(() => import("./Components/NotFound/NotFound.jsx"));
const SuccessPage = React.lazy(() =>
    import("./Components/SuccessPage/SuccessPage.jsx")
);

// Router setup with lazy-loaded components
const router = createBrowserRouter([
    // Public routes (without sidebar)
    {
        path: "/landpage",
        element: <LandPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/doctor-signup",
        element: <DoctorSignup />,
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
        path: "/checkout/success",
        element: <SuccessPage />,
    },

    // Protected routes with sidebar
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AuthContextProvider>
                    <MainLayout />
                </AuthContextProvider>
            </ProtectedRoute>
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
                path: "chats",
                element: <Chats />,
            },
            {
                path: "doctor-finder",
                element: <Doctors />,
            },
            {
                path: "history",
                element: <History />,
            },
        ],
    },

    // 404 page
    {
        path: "*",
        element: <NotFound />,
    },
]);

let query = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={query}>
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
                    <Chatbot />
                    <RouterProvider router={router} />
                </React.Suspense>
            </AuthContextProvider>
        </QueryClientProvider>
    );
}

export default App;
