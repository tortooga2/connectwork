import { auth } from "@clerk/nextjs/server";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Dashboard } from "./(pages)/dashboard/client";

export default async function Home() {
    const { userId } = await auth();
    if (userId) {
        return <Dashboard />;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--theme-bg-primary)",
                color: "var(--theme-text-primary)",
                padding: "var(--theme-spacing-lg)",
                boxSizing: "border-box",
            }}
        >
            {/* Centered sign-in / sign-up card */}
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.5rem",
                    maxWidth: "420px",
                    width: "100%",
                    padding: "2.5rem",
                    background: "var(--theme-bg-secondary)",
                    border: "var(--theme-border-width) solid var(--theme-border-primary)",
                    borderRadius: "var(--theme-border-radius)",
                    boxShadow: "var(--theme-shadow-lg)",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.25rem",
                        fontWeight: 700,
                        margin: 0,
                        color: "var(--theme-btn-linq-text)",
                        fontFamily: "var(--font-geist-sans, 'EB Garamond', serif)",
                    }}
                >
                    Linquiq
                </h1>
                <p
                    style={{
                        fontSize: "1rem",
                        lineHeight: 1.5,
                        color: "var(--theme-text-secondary)",
                        textAlign: "center",
                        margin: 0,
                    }}
                >
                    Capture your info from conferences and events — links, business cards, photos, and notes in one place.
                </p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        width: "100%",
                        marginTop: "0.5rem",
                    }}
                >
                    <SignedOut>
                        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                            <button
                                type="button"
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    border: "var(--theme-border-width) solid var(--theme-btn-linq-border)",
                                    borderRadius: "var(--theme-border-radius)",
                                    background: "var(--theme-btn-linq-bg)",
                                    color: "var(--theme-btn-linq-text)",
                                    cursor: "pointer",
                                    transition: "background 0.2s, opacity 0.2s",
                                }}
                            >
                                Sign up
                            </button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                            <button
                                type="button"
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    border: "var(--theme-border-width) solid var(--theme-border-primary)",
                                    borderRadius: "var(--theme-border-radius)",
                                    background: "transparent",
                                    color: "var(--theme-text-primary)",
                                    cursor: "pointer",
                                    transition: "background 0.2s, opacity 0.2s",
                                }}
                            >
                                Sign in
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </main>

            <footer
                style={{
                    marginTop: "2rem",
                    fontSize: "0.8rem",
                    color: "var(--theme-text-tertiary)",
                }}
            >
                © 2025 Linquiq. All rights reserved.
            </footer>
        </div>
    );
}
