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
                                        text="Aurix Terms And Conditions"
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
                                    <strong>1. Acceptance of Terms</strong><br />
                                    By accessing or using Aurix, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.<br /><br />
                                    <strong>2. Service Description</strong><br />
                                    Aurix is a web-based platform that enables users to create applications and websites using AI-assisted tools. The platform leverages sandboxed code execution, third-party AI providers, and cloud-based infrastructure. All user actions, prompts, and results may be logged for quality, security, and debugging purposes.<br /><br />
                                    <strong>3. AI-Assisted Tools Disclaimer</strong><br />
                                    Aurix uses artificial intelligence and large language models to assist with code generation, suggestions, and automation. AI-generated outputs may be inaccurate, incomplete, or inappropriate. You are responsible for reviewing and validating all outputs before use. Aurix and its operators are not liable for any damages or losses resulting from reliance on AI-generated content.<br /><br />
                                    <strong>4. Logging and Data Usage</strong><br />
                                    All interactions, including prompts, code, and results, may be logged and stored for the purposes of improving service quality, security, and compliance. Logs may include user identifiers, project data, and metadata. Such logging is conducted in accordance with our Privacy Policy.<br /><br />
                                    <strong>5. Sandboxed Execution</strong><br />
                                    Code execution occurs in isolated sandbox environments. While Aurix takes reasonable measures to ensure security, you acknowledge that sandboxing is not foolproof and agree not to attempt to bypass or exploit the sandbox environment.<br /><br />
                                    <strong>6. Third-Party AI Providers</strong><br />
                                    Aurix integrates with third-party AI and cloud service providers (such as OpenAI, Groq, and others). Your data and prompts may be transmitted to and processed by these providers. Aurix is not responsible for the actions or policies of third-party providers.<br /><br />
                                    <strong>7. User Responsibilities</strong><br />
                                    You must be at least 18 years old to use Aurix.<br />
                                    You agree to use Aurix only for lawful purposes and not to submit, generate, or distribute content that is illegal, harmful, or violates the rights of others. You are responsible for all activity conducted under your account.<br /><br />
                                    <strong>8. Limitation of Liability</strong><br />
                                    Aurix is provided {"as is"} without warranties of any kind. To the fullest extent permitted by law, Aurix and its operators disclaim all liability for damages arising from your use of the service, including but not limited to AI-generated errors, data loss, or service interruptions.<br /><br />
                                    <strong>9. Termination</strong><br />
                                    Aurix reserves the right to suspend or terminate your access to the service at any time, with or without notice, if you violate these Terms or misuse the platform. Upon termination, your right to use the service will immediately cease.<br /><br />
                                    <strong>10. Modifications</strong><br />
                                    Aurix may update these Terms and Conditions at any time. Continued use of the service constitutes acceptance of the revised terms.<br /><br />
                                    <strong>11. Governing Law and Jurisdiction</strong><br />
                                    These Terms and Conditions are governed by the laws of India. Any disputes arising from or relating to these terms or your use of Aurix shall be subject to the exclusive jurisdiction of the courts of India.<br /><br />
                                    <strong>12. Contact</strong><br />
                                    For questions, concerns, or legal notices, please contact us at: 0xblackstack@gmail.com
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
