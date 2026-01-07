import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!email) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "L'email n'est pas valide";
        }
        
        if (!password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        // Simulation d'une requête API (sera remplacé par le backend plus tard)
        setTimeout(() => {
            console.log("Données de connexion:", { email, password });
            setIsLoading(false);
            // Ici, vous ajouterez la logique de connexion réelle plus tard
        }, 1000);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
            
            <div className="login-content">
                <div className="login-card">
                    <div className="login-header">
                        <h1></h1>
                        <p>Bienvenue ! Connectez-vous à votre compte</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="ex: pascal@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors({ ...errors, email: "" });
                                }
                            }}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors({ ...errors, password: "" });
                                }
                            }}
                            error={errors.password}
                            required
                        />

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Se souvenir de moi</span>
                            </label>
                            <a href="#" className="forgot-password">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <Button 
                            text={isLoading ? "Connexion..." : "Se connecter"} 
                            type="submit"
                            disabled={isLoading}
                        />

                        <div className="login-divider">
                            <span>ou</span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="social-btn google-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continuer avec Google
                            </button>
                        </div>

                        <p className="signup-link">
                            Pas encore de compte ? <a href="#">S'inscrire</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
