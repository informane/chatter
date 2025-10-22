'use client';
import React from 'react';
import { SessionProvider } from "next-auth/react";
export var AuthProvider = function (_a) {
    var children = _a.children;
    return (<SessionProvider>{children}</SessionProvider>);
};
