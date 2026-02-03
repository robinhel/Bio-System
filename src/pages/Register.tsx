RegisterPage.route = {
    path: '/register-page',
    index: 7,
};
export default function RegisterPage() {
    return <>
        <div className="auth-page">
            <h1 className="auth-title">Skapa Konto</h1>
            <p className="auth-label">E-post (användarnamn) </p>
            <input
                type="text"
                name="email"
                required
            />
            <p className="auth-label">Lösenord</p>
            <input
                type="password"
                name="password"
                required
            />

            <button className="auth-btn">Skapa Konto</button>
        </div>




    </>
}