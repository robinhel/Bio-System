import { Link } from 'react-router-dom';

LoginPage.route = {
    path: '/login-page',
    menuLabel: 'Logga In',
    index: 6,
};

export default function LoginPage() {
    return <>
        <div>
            <h1>Logga In</h1>
            <p>E-post (användarnamn)</p>
            <input
                type="text"
            />
            <p>Lösenord</p>
            <input
                type="password"
            /><br />
            <button>Logga In</button>
        </div>

        <Link to="/register-page">
            <button>Klicka här för att registrera ett nytt konto</button>
        </Link>
    </>;
}