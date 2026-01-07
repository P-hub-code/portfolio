import "./Button.css";

function Button({ text, type = "button", onClick, disabled = false, variant = "primary" }) {
    return (
        <button
            type={type}
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;

