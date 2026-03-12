import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

Profile.route = {
    path: '/Profile',
    menuLabel: 'Profile',
    index: 11,
};

export default function Profile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await fetch('/api/login', { method: 'DELETE', credentials: 'include' });
        setUser(null);
        navigate('/login-page');
    }

    return <>
        <div className="cancelbooking">
            <h1 className="cancelbooking-title">Profil</h1>
            <p className="cancelbooking-label">Du är inloggad som: {user?.firstName}</p>
            <p className="cancelbooking-label">E-post: {user?.email}</p>
            <button className="auth-btn" onClick={handleLogout}>Logga ut</button>
        </div>
    </>;
}