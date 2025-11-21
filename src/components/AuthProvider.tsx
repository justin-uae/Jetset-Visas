import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUser } from '../redux/slices/authSlice';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();
    const { accessToken, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // If we have a token but no user data, fetch the user
        if (accessToken && !user) {
            dispatch(fetchCurrentUser(accessToken));
        }
    }, [accessToken, user, dispatch]);

    return <>{children}</>;
};

export default AuthProvider;