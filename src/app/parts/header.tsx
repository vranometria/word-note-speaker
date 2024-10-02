"use client";
import { signOut } from "aws-amplify/auth"
import { getCurrentUser, GetCurrentUserOutput } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState<GetCurrentUserOutput>();
    const router = useRouter();
    
    useEffect(() => {
        async function setUserInfo(){
            const result = await getCurrentUser();
            setUser(result);
        };
        setUserInfo();
    }, []);


    const events = {
        signOut: () => {
            signOut();
            router.push("/");
        }
    }

    return (
        <header className="header">
            <div className="pl-5 pt-3">
                <h1>Word Note Speaker</h1>
            </div>
            <div className="flex">
                <div className="pt-3 pr-10">UserName : { user?.username }</div>
                <button type="button" className="common-button" onClick={events.signOut}>Sign out</button>
            </div>
        </header>
    );
}