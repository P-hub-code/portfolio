import { Link, Outlet } from "react-router-dom";
import { userStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import LandingPage from "../pages/LandingPage";

interface User {
    name: string;
}

function Default() {
    const { user, token, notification, setUser, setToken } = userStateContext();

    // If the user is not logged in, redirect to the login page
    if (!token) {
        return <LandingPage />;
    }

    const onLogout = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <aside>
                <Link to="/">Home</Link>
                <Link to="/parts">Peças</Link>
                <Link to="/boxes">Caixas</Link>
                <Link to="/sales">Vendas</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Garagem</div>
                    <div>
                        Bem vindo, <strong>{(user as User)?.name}</strong>!
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Sair
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}

export default Default;
