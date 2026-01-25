import styles from "./page.module.css";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Home() {
    const { userId } = await auth();
    console.log("userId", userId);
    if (userId) {
        redirect("/dashboard");
    }

    return (
        <div className={styles.page}>
            <header
                style={{
                    width: "100%",
                }}
            >
                <nav
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem 2rem",
                    }}
                >
                    <h1>Linquiq</h1>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                    </div>
                </nav>
            </header>

            <main className="landing-main">
                <section className="hero-section">
                    <div className="hero-left">
                        <h2 className="hero-heading">Capture Your Info</h2>
                        <p className="hero-description">
                            Create your personalized layout of information from
                            conferences and expo events that has links, business
                            cards, photos, and detailed description of your
                            links such as date, location, and type.
                        </p>
                        {/* <button className="start-button" onClick={() => console.log('Start Here Clicked')}>Start Here</button> */}
                    </div>
                    <div className="hero-right"></div>
                </section>
            </main>

            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "#cc674b",
                    fontSize: "0.8rem",
                    fontFamily: `"Playfair Display", serif`,
                    padding: "0.5rem",
                }}
            >
                @2025 Bundle,{" "}
                <span style={{ fontStyle: "italic" }}>
                    {" "}
                    Networking Application{" "}
                </span>
                . All rights reserved.
            </div>
        </div>
    );
}
