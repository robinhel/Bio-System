import { Link } from 'react-router-dom';

LoginPage.route = {
    path: '/login-page',
    menuLabel: 'Logga In',
    index: 6,
};

export default function LoginPage() {
    return <>
        <div className="auth-page">
            <h1 className="auth-title">Logga In</h1>

            <p className="auth-label">E-post (användarnamn)</p>
            <input type="text" />

            <p className="auth-label">Lösenord</p>
            <input type="password" /><br />

            <button className="auth-btn">Logga In</button>
        </div>

        <Link className="auth-link" to="/register-page">
            <button className="auth-btn">Klicka här för att registrera ett nytt konto</button>
        </Link>
    </>;
}