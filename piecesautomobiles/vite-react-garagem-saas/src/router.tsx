import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import NotFound from "./views/NotFound";
import Default from "./layouts/Default";
import Guest from "./layouts/Guest";
import Dashboard from "./views/Dashboard";
import Parts from "./views/Parts";
import PartsForm from "./views/PartsForm";
import Boxes from "./views/Boxes";
import BoxesForm from "./views/BoxesForm";
import Sales from "./views/Sales";
import SalesForm from "./views/SalesForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Default />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/parts",
                element: <Parts />,
            },
            {
                path: "/parts/create",
                element: <PartsForm key={"partsCreate"} />,
            },
            {
                path: "/parts/:id/edit",
                element: <PartsForm key={"partsUpdate"} />,
            },
            {
                path: "/boxes",
                element: <Boxes />,
            },
            {
                path: "/boxes/create",
                element: <BoxesForm key={"boxesCreate"} />,
            },
            {
                path: "/boxes/:id/edit",
                element: <BoxesForm key={"boxesUpdate"} />,
            },
            {
                path: "/sales",
                element: <Sales />,
            },
            {
                path: "/sales/create",
                element: <SalesForm key={"salesCreate"} />,
            },
            {
                path: "/sales/:id/edit",
                element: <SalesForm key={"salesUpdate"} />,
            },
        ],
    },
    {
        path: "/",
        element: <Guest />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
