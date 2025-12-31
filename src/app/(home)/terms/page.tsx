"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import SplitText from "@/components/SplitText";
import Aurora from '@/components/Aurora';
import "../pixelSnow.css"

import PixelSnow from '@/components/PixelSnow';


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


    const snowColor = "#9ca3af"; // gray-400 in light


    useEffect(() => {
        if (
            resolvedTheme === "light"
        ) {
            toast.info("We recommand to use our website in dark theme.");
        }
    }, [resolvedTheme]);
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
                {mounted && !isSmall && resolvedTheme !== "light" && (
                    <Aurora
                        colorStops={["#5227FF", "#7cff67", "#5227FF"]}
                        amplitude={1}
                        blend={0.5}
                    />
                )}


                {mounted && (
                    <PixelSnow
                        color={snowColor}
                        pixelResolution={500}
                        speed={1.4}
                        density={0.25}
                        flakeSize={0.013}
                        brightness={0.8}
                        depthFade={20}
                        farPlane={20}
                        direction={125}
                        variant="square"
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









                                <div className="text-left max-w-4xl mx-auto text-base md:text-lg space-y-6">
                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">1. Introduction and Acceptance of Terms</h2>
                                        <p className="mb-4">
                                            {'Welcome to Aurix ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the Aurix platform, including our website, mobile applications, and related services (collectively, the "Service").'}
                                        </p>
                                        <p className="mb-4">
                                            By accessing, browsing, or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
                                        </p>
                                        <p>
                                            These Terms constitute a legally binding agreement between you and Aurix. By using our Service, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                                        <p className="mb-4">
                                            Aurix is an AI-powered platform that enables users to create, develop, and deploy web applications and websites through natural language prompts and AI-assisted coding tools. Our Service includes:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>AI-assisted code generation and application development</li>
                                            <li>Sandboxed code execution environments</li>
                                            <li>Real-time preview and testing capabilities</li>
                                            <li>Project management and collaboration tools</li>
                                            <li>Integration with third-party AI and cloud service providers</li>
                                            <li>Referral and rewards system</li>
                                        </ul>
                                        <p>
                                            Our Service leverages advanced artificial intelligence technologies, including large language models and machine learning algorithms, to assist users in their development workflows.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">3. AI-Assisted Tools and Content Disclaimer</h2>
                                        <p className="mb-4">
                                            <strong>Important Disclaimer:</strong>{' Aurix utilizes artificial intelligence and machine learning technologies to assist with code generation, application development, and related tasks. AI-generated content and outputs are provided "as is" and may contain inaccuracies, errors, or incomplete information.'}
                                        </p>
                                        <p className="mb-4">
                                            You acknowledge and agree that:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>AI-generated code, suggestions, and outputs are not guaranteed to be correct, complete, or suitable for your intended use</li>
                                            <li>You are solely responsible for reviewing, testing, and validating all AI-generated content before implementation</li>
                                            <li>AI models may produce biased, inappropriate, or harmful content</li>
                                            <li>You must not rely on AI outputs for critical applications, safety-critical systems, or any use where failure could result in harm, injury, or significant loss</li>
                                            <li>Aurix and its operators are not liable for any damages, losses, or consequences arising from your use or reliance on AI-generated content</li>
                                        </ul>
                                        <p>
                                            You agree to use AI-assisted features responsibly and to implement appropriate safeguards when using AI-generated code in production environments.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">4. User Accounts and Registration</h2>
                                        <p className="mb-4">
                                            To access certain features of our Service, you must create an account. You agree to:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Provide accurate, current, and complete information during registration</li>
                                            <li>Maintain and update your account information as needed</li>
                                            <li>Keep your password and account credentials secure</li>
                                            <li>Notify us immediately of any unauthorized use of your account</li>
                                            <li>Be responsible for all activities conducted under your account</li>
                                        </ul>
                                        <p>
                                            You are prohibited from sharing your account credentials or allowing others to use your account. Aurix reserves the right to suspend or terminate accounts that violate these Terms.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">5. User Content and Conduct</h2>
                                        <p className="mb-4">
                                            <strong>Your Content:</strong> You retain ownership of content you create using Aurix, subject to our license grants below. You are responsible for ensuring you have the right to use any third-party content, code, or materials you input into our Service.
                                        </p>
                                        <p className="mb-4">
                                            <strong>License Grant:</strong> By using our Service, you grant Aurix a worldwide, non-exclusive, royalty-free license to use, store, process, and analyze your content solely for the purpose of providing and improving our Service.
                                        </p>
                                        <p className="mb-4">
                                            <strong>Prohibited Conduct:</strong> You agree not to:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Use the Service for any illegal, harmful, or unauthorized purpose</li>
                                            <li>Submit malicious code, viruses, or harmful content</li>
                                            <li>Attempt to reverse engineer, decompile, or hack the Service</li>
                                            <li>Circumvent security measures or access restrictions</li>
                                            <li>Generate or distribute content that violates intellectual property rights</li>
                                            <li>Harass, abuse, or harm other users</li>
                                            <li>Impersonate others or provide false information</li>
                                            <li>Use automated tools or bots to access the Service</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">6. Third-Party Services and Integrations</h2>
                                        <p className="mb-4">
                                            {"       Aurix integrates with third-party AI providers, cloud services, and external platforms. Your use of these integrations is subject to the respective third parties' terms and policies."}
                                        </p>
                                        <p className="mb-4">
                                            <strong>Third-Party AI Providers:</strong> Your prompts and data may be transmitted to and processed by third-party AI services (including but not limited to OpenAI, Groq, Anthropic, and others). Aurix is not responsible for:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>The privacy practices of third-party providers</li>
                                            <li>The accuracy or reliability of third-party AI outputs</li>
                                            <li>Service interruptions or changes in third-party APIs</li>
                                            <li>Compliance with third-party terms of service</li>
                                        </ul>
                                        <p>
                                            You acknowledge that third-party providers may have their own data retention and usage policies, and you should review their privacy policies before using integrated features.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">7. Sandboxed Execution and Security</h2>
                                        <p className="mb-4">
                                            <strong>Sandbox Environment:</strong> Code execution occurs in isolated sandbox environments designed to prevent unauthorized access to external systems. However, you acknowledge that:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Sandboxing is not foolproof and may have limitations</li>
                                            <li>You should not submit sensitive, confidential, or personal information in code or prompts</li>
                                            <li>You should not attempt to bypass or exploit sandbox restrictions</li>
                                            <li>Aurix does not guarantee complete isolation or security</li>
                                        </ul>
                                        <p className="mb-4">
                                            <strong>Security Measures:</strong> While Aurix implements industry-standard security measures, no system is completely secure. You use our Service at your own risk and should implement additional security measures for sensitive applications.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
                                        <p className="mb-4">
                                            <strong>Aurix IP:</strong> The Service, including its software, algorithms, user interface, trademarks, and content, is owned by Aurix and protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer our Service without permission.
                                        </p>
                                        <p className="mb-4">
                                            <strong>User Content:</strong> You retain ownership of content you create, subject to our license grant above. You are responsible for ensuring your content does not violate third-party intellectual property rights.
                                        </p>
                                        <p>
                                            <strong>Open Source:</strong> Aurix may incorporate open-source software. Such components are subject to their respective licenses, which you can review in our documentation.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">9. Referral Program</h2>
                                        <p className="mb-4">
                                            Aurix offers a referral program where users can earn rewards by inviting others to join the platform. Terms specific to the referral program include:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Referral codes are generated automatically for each user</li>
                                            <li>Rewards are subject to verification and may have expiration dates</li>
                                            <li>Fraudulent referrals or abuse of the program may result in account suspension</li>
                                            <li>Referral rewards are not transferable and have no cash value unless otherwise specified</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">10. Payment Terms (if applicable)</h2>
                                        <p className="mb-4">
                                            Certain features of Aurix may require payment. If you purchase paid services:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>All fees are non-refundable unless otherwise stated</li>
                                            <li>Subscription fees are billed in advance and automatically renew</li>
                                            <li>You are responsible for all applicable taxes</li>
                                            <li>Failed payments may result in service suspension</li>
                                            <li>Price changes will be communicated with advance notice</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">11. Service Availability and Support</h2>
                                        <p className="mb-4">
                                            <strong>Availability:</strong> Aurix strives for high availability but does not guarantee uninterrupted service. The Service may be unavailable due to maintenance, technical issues, or force majeure events.
                                        </p>
                                        <p className="mb-4">
                                            <strong>Support:</strong> Basic support is provided through our documentation and community channels. Premium support may be available for paid users.
                                        </p>
                                        <p>
                                            <strong>Beta Features:</strong> Beta features are provided {'"as is" '}and may contain bugs or incomplete functionality. Use beta features at your own risk.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">12. Disclaimers and Limitation of Liability</h2>
                                        <p className="mb-4">
                                            <strong>Service Disclaimer:</strong> {'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'}
                                        </p>
                                        <p className="mb-4">
                                            <strong>AI Content Disclaimer:</strong> AI-generated content is provided without warranty. Aurix does not guarantee the accuracy, completeness, or suitability of AI outputs.
                                        </p>
                                        <p className="mb-4">
                                            <strong>Limitation of Liability:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, AURIX AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
                                        </p>
                                        <p>
                                            <strong>Maximum Liability:</strong> {"IN NO EVENT SHALL AURIX'S TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM."}
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">13. Indemnification</h2>
                                        <p>
                                            {"              You agree to indemnify, defend, and hold harmless Aurix and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:"}
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Your use of the Service</li>
                                            <li>Your violation of these Terms</li>
                                            <li>Your violation of any third-party rights</li>
                                            <li>Any content you submit or generate using the Service</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">14. Termination</h2>
                                        <p className="mb-4">
                                            <strong>Termination by User:</strong> You may terminate your account at any time by contacting support or using account settings.
                                        </p>
                                        <p className="mb-4">
                                            <strong>Termination by Aurix:</strong> Aurix may suspend or terminate your access to the Service immediately, without prior notice, for any violation of these Terms or for any other reason we deem necessary.
                                        </p>
                                        <p>
                                            <strong>Effect of Termination:</strong> Upon termination, your right to use the Service ceases immediately. Aurix may delete your account and data in accordance with our data retention policies.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">15. Modifications to Terms</h2>
                                        <p className="mb-4">
                                            Aurix reserves the right to modify these Terms at any time. We will notify users of material changes through:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Email notifications</li>
                                            <li>In-app notifications</li>
                                            <li>Website announcements</li>
                                        </ul>
                                        <p>
                                            Your continued use of the Service after changes take effect constitutes acceptance of the modified Terms. If you disagree with the changes, you must stop using the Service.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">16. Governing Law and Dispute Resolution</h2>
                                        <p className="mb-4">
                                            <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
                                        </p>
                                        <p className="mb-4">
                                            <strong>Jurisdiction:</strong> Any disputes arising out of or relating to these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of India.
                                        </p>
                                        <p>
                                            <strong>Dispute Resolution:</strong> Before initiating litigation, you agree to attempt to resolve disputes through good faith negotiations. Aurix may require mediation or arbitration for certain disputes.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">17. Severability and Entire Agreement</h2>
                                        <p className="mb-4">
                                            <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                                        </p>
                                        <p>
                                            <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Aurix regarding your use of the Service.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">18. Contact Information</h2>
                                        <p className="mb-4">
                                            If you have any questions, concerns, or legal notices regarding these Terms, please contact us:
                                        </p>
                                        <div className="bg-muted/50 p-4 rounded border">
                                            <p><strong>Email:</strong> 0xblackstack@gmail.com</p>
                                            <p><strong>Subject Line:</strong> Terms and Conditions Inquiry</p>
                                            <p><strong>Response Time:</strong> We aim to respond within 5-7 business days</p>
                                        </div>
                                        <p className="mt-4">
                                            {'    For urgent security issues, please contact us immediately with "SECURITY" in the subject line.'}
                                        </p>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded border text-center">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Last Updated:</strong> 30 December 2025s
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            These Terms and Conditions were last reviewed and updated to ensure compliance with current laws and best practices.
                                        </p>
                                    </div>
                                </div>
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
