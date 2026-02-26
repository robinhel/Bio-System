import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

RegisterPage.route = {
    path: '/register-page',
    index: 7,
};

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            navigate('/login-page');
        }
    }

    return <>
        <div className="auth-page">
            <form onSubmit={handleRegister}>
                <h1 className="auth-title">Skapa Konto</h1>

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
                />

                <button type="submit" className="auth-btn">Skapa Konto</button>
            </form>
        </div>
    </>;
}