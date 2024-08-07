import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userData) => {
            console.log('got user: ', userData);
            setUser(userData);
        });
        return unsubscribe;
    }, []);

    return { user };
}
