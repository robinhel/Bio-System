RegisterPage.route = {
    path: '/register-page',
    index: 7,
};
export default function RegisterPage() {
    return <>
        <div className="auth-page">
            <h1 >Skapa Konto</h1>
            <p>E-post (användarnamn)</p>
            <input
                type="text"
            />
            <p>Lösenord</p>
            <input
                type="password"
            /><br />
            <button>Skapa Konto</button>
        </div>




    </>
}