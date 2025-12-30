import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { userStateContext } from "../contexts/ContextProvider";

function Login() {
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    type ErrorType = {
        email: string[];
    };
    const [errors, setErrors] = useState<ErrorType | null>(null);
    const { setUser, setToken } = userStateContext();

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
        };
        setErrors(null);
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Entrar no sistema</h1>
                    {errors && (
                        <div className="alert alert-danger">
                            <ul>
                                {Object.entries(errors).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            ref={emailRef}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Senha"
                            ref={passwordRef}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Entrar
                        </button>
                    </div>
                    <div className="form-group">
                        <p className="message">
                            Não tem uma conta?{" "}
                            <Link to="/signup">Cadastre-se</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
