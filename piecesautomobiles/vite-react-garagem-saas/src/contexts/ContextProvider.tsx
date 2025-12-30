import { createContext, useContext, useState, ReactNode } from "react";

interface StateContextProps {
    user: null | object;
    token: null | string;
    notification: null | string;
    setUser: (user: null | object) => void;
    setToken: (token: null | string) => void;
    setNotification: (notification: null | string) => void;
}

const StateContext = createContext<StateContextProps>({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<null | object>(null);
    const [notification, _setNotification] = useState<null | string>(null);
    const [token, _setToken] = useState<null | string>(
        localStorage.getItem("ACCESS_TOKEN")
    );

    const setNotification = (notification: null | string) => {
        _setNotification(notification);
        setTimeout(() => {
            _setNotification(null);
        }, 5000);
    };

    const setToken = (token: null | string) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token.toString());
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const userStateContext = () => useContext(StateContext);
