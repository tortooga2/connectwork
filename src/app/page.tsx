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
            <header className={styles.authHeader}>
                <h1 className={styles.authTitle}>Linquiq</h1>
                <div className={styles.authButtons}>
                    <SignedOut>
                        <SignInButton>
                            <button type="button" className={styles.authBtn}>
                                Sign in
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button type="button" className={styles.authBtn}>
                                Sign up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                </div>
            </header>

            <main className={styles.landingMain}>
                <section className={styles.heroSection}>
                    <h2 className={styles.heroHeading}>Capture Your Info</h2>
                    <p className={styles.heroDescription}>
                        Create your personalized layout of information from
                        conferences and expo events that has links, business
                        cards, photos, and detailed description of your
                        links such as date, location, and type.
                    </p>
                </section>
            </main>

            <footer className={styles.landingFooter}>
                © 2025 Bundle, <em>Networking Application</em>. All rights reserved.
            </footer>
        </div>
    );
}
