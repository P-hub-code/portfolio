import { Navigate, Outlet } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";

function Guest() {
    const { token } = userStateContext();
    // If the user is logged in, redirect to the home page
    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Guest;
