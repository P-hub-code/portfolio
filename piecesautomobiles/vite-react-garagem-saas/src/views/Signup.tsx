import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { userStateContext } from "../contexts/ContextProvider";

function Signup() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    type Errors = {
        [key: string]: string;
    };
    const [errors, setErrors] = useState<Errors>({});
    const { setUser, setToken } = userStateContext();

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const payload = {
            name: nameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            password_confirmation: passwordConfirmationRef.current?.value,
        };
        axiosClient
            .post("/register", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Cadastre-se</h1>

                    {Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {Object.entries(errors).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nome"
                            ref={nameRef}
                        />
                    </div>
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
                        <label htmlFor="password_confirmation">
                            Confirme a senha
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="Confirme a senha"
                            ref={passwordConfirmationRef}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Criar conta
                        </button>
                    </div>
                    <div className="form-group">
                        <p className="message">
                            Já tem uma conta? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
