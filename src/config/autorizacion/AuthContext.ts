// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContextType } from './AuthProvider';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
