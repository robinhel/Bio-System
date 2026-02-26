import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

LoginPage.route = {
    path: '/login-page',
    menuLabel: 'Logga In',
    index: 6,
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const errorMessages: Record<string, string> = {
        'No such user.': 'Det finns inget konto med den e-postadressen.',
        'Password mismatch.': 'Fel lösenord.',
        'A user is already logged in.': 'En användare är redan inloggad.',
    };

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && !data.error) {
            navigate('/');
        } else {
            const msg = data?.error;
            setError(errorMessages[msg] ?? msg ?? 'Något gick fel, försök igen.');
        }
    }

    return <>
        <div className="auth-page">
            <form onSubmit={handleLogin}>
                <h1 className="auth-title">Logga In</h1>

                <p className="auth-label">E-post</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <p className="auth-label">Lösenord</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />

                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="auth-btn">Logga In</button>
            </form>
        </div>

        <Link className="auth-link" to="/register-page">
            <button className="auth-btn">Skapa konto</button>
        </Link>
    </>;
}