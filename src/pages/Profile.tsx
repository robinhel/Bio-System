import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";


Profile.route = {
    path: '/Profile',
    menuLabel: 'Profile',
    index: 11,
};

export default function Profile() {
    const { user } = useAuth();

    return <>

        <div className="cancelbooking">
            <h1 className="cancelbooking-title">Profil</h1>

            <p className="cancelbooking-label">Du är inloggad som: {user?.firstName}</p>
            <p className="cancelbooking-label">E-post: {user?.email}</p>


        </div>


    </>
}