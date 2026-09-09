import { Navigate } from "react-router";
import { useAuthStore } from '../store/authStore.js';

export function ProtectedRoute({ children, redirectTo = "/login" }) {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn); // () lo deja en blanco

    if (!isLoggedIn) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}