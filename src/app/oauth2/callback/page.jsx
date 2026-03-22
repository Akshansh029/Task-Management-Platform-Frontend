"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OAuth2Callback() {
    const router = useRouter();
    const hasExchanged = useRef(false); // ✅ prevents double execution

    useEffect(() => {
        if (hasExchanged.current) return; // ✅ skip if already ran
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
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth2/token?code=${code}`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Exchange failed:", errorText); // ✅
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