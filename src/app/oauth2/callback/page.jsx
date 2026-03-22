"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OAuth2Callback() {
    const router = useRouter();
    const hasExchanged = useRef(false);

    useEffect(() => {
        if (hasExchanged.current) return;
        hasExchanged.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            router.replace("/login?error=oauth_failed");
            return;
        }

        window.history.replaceState({}, document.title, "/oauth2/callback");

        const exchange = async () => {
            try {
                const res = await fetch(
                    `/api/auth/oauth2/token?code=${code}`,
                    { method: "POST" }
                );

                console.log("Exchange status:", res.status);

                if (!res.ok) {
                    const err = await res.text();
                    console.error("Exchange failed:", err);
                    router.replace("/login?error=oauth_failed");
                    return;
                }

                router.replace("/");

            } catch (err) {
                console.error("OAuth2 exchange error:", err);
                router.replace("/login?error=oauth_failed");
            }
        };

        exchange();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-sm text-muted-foreground">Signing you in...</p>
        </div>
    );
}