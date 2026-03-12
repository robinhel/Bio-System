import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserType {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
interface AuthContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        fetch('/api/login', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data?.email) setUser(data);
                else setUser(null);
            })
            .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}