import "./LandingPage.css";

function LandingPage() {
    return (
        <div className="landing-container">
            <div className="top-bar">
                <div className="logo">Pieces Automobile</div>
                <div className="auth-buttons">
                    <a href="/login" className="signin-button">
                        Login
                    </a>
                    <a href="/signup" className="signup-button">
                        Registre
                    </a>
                </div>
            </div>
            <div className="hero">
                <div className="hero-left">
                    <h1>Bienvenue !</h1>
                    <p>
                        Le système parfait pour administrer vos pièces
                        auto.
                    </p>
                </div>
                <div className="hero-right">
                    <img src="screencapture.png" alt="System preview" />
                </div>
            </div>
            <div className="main-content">
                <div className="feature">
                    <h2>gérer vos pièces</h2>
                    <p>
                        Organisez et contrôlez toutes les pièces de votre inventaire
                        forme efficace.
                    </p>
                </div>
                <div className="feature">
                    <h2>Catégoriser et rencontrer facilement</h2>
                    <p>
                        Classifique selon les catégories par catégories et rencontres avec celles-ci
                        précisamente rapidement.
                    </p>
                </div>
                <div className="feature">
                    <h2>Contrôle des ventes</h2>
                    <p>
                        Pièces détachées pour arche, vendues avec accès aux rapports.
                        Détails des ventes.
                </div>
            </div>
            <div className="landing-cta">
                <h2>Comece hoje</h2>
                <a href="/signup" className="cta-button">
                    Inscrivez-vous maintenant
                </a>
            </div>
            <div className="landing-footer">
            </div>
        </div>
    );
}

export default LandingPage;
