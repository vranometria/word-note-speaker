'use client';
import { createContext } from "react";

export const AppContext = createContext({
    questionUrl: "http://localhost:9000/questions",
    tagUrl: "http://localhost:9000/tags",
});