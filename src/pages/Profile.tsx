

Profile.route = {
    path: '/Profile',
    menuLabel: 'Profil',
    index: 11,
};

export default function Profile() {
    return <>

        <div className="cancelbooking">
            <h1 className="cancelbooking-title">Profil</h1>

            <p className="cancelbooking-label">Du är inloggad som: user</p>



            <button className="cancelbooking-btn">Se dina bokningar</button>



        </div>


    </>
}