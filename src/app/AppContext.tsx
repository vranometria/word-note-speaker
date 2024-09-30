'use client';
import { createContext } from "react";

export const AppContext = createContext({
    questionUrl: process.env.NEXT_PUBLIC_QUESTION_ENDPOINT as string,
    tagUrl: process.env.NEXT_PUBLIC_TAG_ENDPOINT as string, 
});