import { useState, useEffect, } from 'react';

interface User {
    username: string;
}

export function useAuth() {

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        fetch('/api/auth/user', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)  // null om ej inloggad
            .then(data => setUser(data))
    }, [])

    return user;
}