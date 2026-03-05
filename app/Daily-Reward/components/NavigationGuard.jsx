"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const NavigationGuard = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-white">Checking authentication...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
