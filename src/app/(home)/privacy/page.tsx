"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import SplitText from "@/components/SplitText";
import Aurora from '@/components/Aurora';
import "../pixelSnow.css"



// Component added by Ansh - github.com/ansh-dhanani

import GradualBlur from '@/components/GradualBlur';
import { useTheme } from "next-themes";
const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};

export default function Home() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { resolvedTheme } = useTheme();



    useEffect(() => {
        if (
            resolvedTheme === "light"
        ) {
            toast.info("We recommand to use our website in dark theme.");
        }
    }, []);
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const check = () => setIsSmall(window.innerWidth < 640); // sm breakpoint
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    const blurStrength = resolvedTheme === "light" ? 2 : 3;
    const blurDivs = resolvedTheme === "light" ? 5 : 7;


    return (
        <>
            {/* PixelSnow background */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            >
                {mounted && resolvedTheme !== "light" && (
                    <Aurora
                        colorStops={["#5227FF", "#7cff67", "#5227FF"]}
                        amplitude={1}
                        blend={0.5}
                    />
                )}

            </div>

            {/* Your $2M UI untouched */}
            <section
                style={{
                    position: "relative",
                    height: "100vh",
                    overflow: "hidden",
                    zIndex: 1,
                }}
            >
                <div style={{ height: "100vh", overflowY: "auto", padding: "6rem 2rem 5rem 2rem" }}>
                    <div>
                        {mounted && !isSmall && resolvedTheme !== "light" && (
                            ""
                        )}



                        <div className="flex flex-col max-w-5xl mx-auto w-full px-4">
                            <section className="space-y-6 py-[16vh] pt-[1vh] 2xl:py-48">
                                <div className="flex flex-col items-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Aurix"
                                        width={75}
                                        height={75}
                                        className="hidden md:block"
                                        priority
                                    />
                                </div>

                                <div className="flex justify-center text-center">
                                    <SplitText
                                        text="Aurix Privacy And Policy"
                                        className="text-2xl md:text-5xl font-bold text-center"
                                        delay={40}
                                        duration={0.4}
                                        ease="power3.out"
                                        splitType="chars"
                                        from={{ opacity: 0, y: 40 }}
                                        to={{ opacity: 1, y: 0 }}
                                        threshold={0.1}
                                        rootMargin="-100px"
                                        textAlign="center"
                                        onLetterAnimationComplete={handleAnimationComplete}
                                    />
                                </div>









                                <p className="text-left max-w-3xl mx-auto text-base md:text-lg">
                                    <strong>1. Introduction</strong><br />
                                    This Privacy Policy explains how Aurix collects, uses, and protects your information when you use our platform.<br /><br />
                                    <strong>2. Information We Collect</strong><br />
                                    We collect information you provide directly (such as prompts, code, and feedback), as well as technical data (such as device, browser, and usage logs). All interactions, including prompts and results, may be logged for quality, security, and compliance. This may include logging of prompts, AI responses, timestamps, model usage, and sandbox activity for safety, debugging, and abuse prevention.<br /><br />
                                    <strong>3. Use of Information</strong><br />
                                    Your information is used to operate, maintain, and improve Aurix, including AI-assisted features, debugging, analytics, and security. We may use logs to monitor for abuse and to enhance the user experience.<br /><br />
                                    <strong>4. AI-Assisted Tools and Third-Party Providers</strong><br />
                                    Aurix integrates with third-party AI and cloud providers (such as OpenAI, Groq, and others). Your data and prompts may be transmitted to and processed by these providers. Third-party providers process data in accordance with their own privacy policies and terms. We are not responsible for the privacy practices of third-party providers.<br /><br />
                                    <strong>5. Sandboxed Execution</strong><br />
                                    Code execution occurs in isolated sandbox environments. While we take reasonable measures to ensure security, sandboxing is not foolproof. Do not submit sensitive or personal information in code or prompts.<br /><br />
                                    <strong>6. Data Security</strong><br />
                                    We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure. Use Aurix responsibly and at your own discretion.<br /><br />
                                    <strong>7. Data Retention</strong><br />
                                    We retain logs and user data as long as necessary for the purposes described above or as required by law. Log data is typically retained for a limited period unless required for security, legal, or compliance purposes. You may request deletion of your data by contacting support, subject to legal and operational requirements.<br /><br />
                                    <strong>8. Your Rights</strong><br />
                                    You may access, update, or request deletion of your personal information by contacting us. We will respond in accordance with applicable law.<br /><br />
                                    <strong>9. Children’s Privacy</strong><br />
                                    Aurix is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors.<br /><br />
                                    <strong>10. Changes to This Policy</strong><br />
                                    We may update this Privacy Policy at any time. Continued use of Aurix constitutes acceptance of the revised policy.<br /><br />
                                    <strong>11. Jurisdiction</strong><br />
                                    This Privacy Policy is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.<br /><br />
                                    <strong>12. Contact</strong><br />
                                    For questions, data requests, or grievances, please contact us at: 0xblackstack@gmail.com
                                </p>
                            </section>

                        </div>

                        <br />
                        <br />

                        <p className="text-muted-foreground text-center">
                            UI effects powered by ReactBits
                        </p>
                    </div>
                </div>

                {mounted && (
                    <GradualBlur
                        target="parent"
                        position="bottom"
                        height="6rem"
                        strength={blurStrength}
                        divCount={blurDivs}
                        curve="bezier"
                        exponential
                        opacity={1}
                    />
                )}
            </section>

        </>
    );
}
