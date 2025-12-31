"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import SplitText from "@/components/SplitText";
import Aurora from '@/components/Aurora';
import "../../pixelSnow.css"
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



    useEffect(() => {
        if (
            resolvedTheme === "light"
        ) {
            toast.info("We recommand to use our website in dark theme.");
        }
    }, [resolvedTheme]);
    const [isSmall, setIsSmall] = useState(false);

    const snowColor = "#9ca3af"; // gray-400 in light

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









                                <div className="text-left max-w-4xl mx-auto text-base md:text-lg space-y-6">
                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                                        <p className="mb-4">
                                            Welcome to Aurix ({'"we,"'} {'"our,"'} or {'"us"'}). This Privacy Policy ({'"Policy"'}) explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our platform (collectively, the {'"Service"'}).
                                        </p>
                                        <p className="mb-4">
                                            We are committed to protecting your privacy and ensuring transparency in our data practices. This Policy describes:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>What information we collect and how we collect it</li>
                                            <li>How we use and process your information</li>
                                            <li>How we share information with third parties</li>
                                            <li>Your rights and choices regarding your information</li>
                                            <li>How we protect your information</li>
                                            <li>How long we retain your information</li>
                                            <li>How we handle international data transfers</li>
                                        </ul>
                                        <p>
                                            By using our Service, you consent to the collection, use, and sharing of your information as described in this Policy. If you do not agree with our policies and practices, please do not use our Service.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                                        <p className="mb-4">
                                            We collect information about you in various ways when you use our Service. This includes:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Information You Provide Directly:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Account Information:</strong> Name, email address, username, and password when you create an account</li>
                                            <li><strong>Profile Information:</strong> Any additional information you choose to provide in your profile</li>
                                            <li><strong>Content:</strong> Code, prompts, comments, feedback, and other content you submit</li>
                                            <li><strong>Communications:</strong> Messages, emails, or other communications you send to us</li>
                                            <li><strong>Payment Information:</strong> Billing information and payment method details (processed by third-party payment processors)</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Information Collected Automatically:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Usage Data:</strong> How you interact with our Service, including pages visited, features used, and time spent</li>
                                            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, and screen resolution</li>
                                            <li><strong>Location Data:</strong> General location information based on IP address</li>
                                            <li><strong>Cookies and Tracking:</strong> Information collected through cookies, web beacons, and similar technologies</li>
                                            <li><strong>Log Data:</strong> Server logs, error logs, and performance data</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">AI and Development Data:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Prompts and Queries:</strong> All text inputs, code prompts, and AI queries you submit</li>
                                            <li><strong>AI Outputs:</strong> Generated code, responses, and suggestions from AI models</li>
                                            <li><strong>Project Data:</strong> Code, files, configurations, and project metadata</li>
                                            <li><strong>Sandbox Activity:</strong> Code execution logs, error messages, and performance metrics</li>
                                            <li><strong>Debugging Information:</strong> Error reports, stack traces, and troubleshooting data</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Information from Third Parties:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Authentication Providers:</strong> Information from services like Clerk or other OAuth providers</li>
                                            <li><strong>Payment Processors:</strong> Transaction data from payment service providers</li>
                                            <li><strong>Analytics Services:</strong> Usage analytics from third-party analytics providers</li>
                                            <li><strong>Referral Data:</strong> Information about referrals and rewards program participation</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                                        <p className="mb-4">
                                            We use the information we collect for various purposes, including:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Service Provision and Operation:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Creating and managing your account</li>
                                            <li>Providing, maintaining, and improving our Service</li>
                                            <li>Processing payments and managing subscriptions</li>
                                            <li>Providing customer support and technical assistance</li>
                                            <li>Communicating with you about your account and our Service</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">AI and Development Features:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Processing your prompts and generating AI responses</li>
                                            <li>Executing code in sandboxed environments</li>
                                            <li>Providing debugging and error analysis</li>
                                            <li>Improving AI model performance and accuracy</li>
                                            <li>Developing new features and capabilities</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Analytics and Improvement:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Analyzing usage patterns and user behavior</li>
                                            <li>Monitoring system performance and reliability</li>
                                            <li>Conducting research and development</li>
                                            <li>Improving user experience and interface design</li>
                                            <li>Detecting and preventing fraud, abuse, and security threats</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Legal and Compliance:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Complying with legal obligations and regulatory requirements</li>
                                            <li>Enforcing our Terms and Conditions</li>
                                            <li>Protecting our rights and the rights of others</li>
                                            <li>Responding to legal requests and preventing harm</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Communication:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Sending service-related notifications and updates</li>
                                            <li>Providing marketing communications (with your consent)</li>
                                            <li>Responding to your inquiries and feedback</li>
                                            <li>Conducting surveys and user research</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
                                        <p className="mb-4">
                                            We may share your information in the following circumstances:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">With Your Consent:</h3>
                                        <p className="mb-4">
                                            We share information when you explicitly consent to such sharing.
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Service Providers and Partners:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>AI Providers:</strong> OpenAI, Groq, Anthropic, and other AI service providers for processing prompts and generating responses</li>
                                            <li><strong>Cloud Infrastructure:</strong> Hosting and computing services for running our platform</li>
                                            <li><strong>Payment Processors:</strong> Stripe, PayPal, or other payment services for processing transactions</li>
                                            <li><strong>Analytics Services:</strong> Tools for analyzing usage and improving our Service</li>
                                            <li><strong>Customer Support:</strong> Third-party support and communication platforms</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Legal Requirements:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>To comply with legal obligations, court orders, or government requests</li>
                                            <li>To enforce our Terms and Conditions or other agreements</li>
                                            <li>To protect the rights, property, or safety of Aurix, our users, or the public</li>
                                            <li>To investigate fraud, security incidents, or violations of law</li>
                                            <li>In connection with a merger, acquisition, or sale of assets</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Business Operations:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>With affiliates and subsidiaries for operational purposes</li>
                                            <li>With business partners for joint marketing or service provision</li>
                                            <li>In aggregated or anonymized form for research and analysis</li>
                                        </ul>

                                        <p className="mb-4">
                                            <strong>Data Minimization:</strong> We only share the minimum information necessary for the specific purpose and implement appropriate safeguards.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
                                        <p className="mb-4">
                                            We use cookies, web beacons, and similar technologies to enhance your experience and analyze usage patterns.
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Types of Cookies We Use:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Essential Cookies:</strong> Required for basic Service functionality</li>
                                            <li><strong>Performance Cookies:</strong> Help us understand how users interact with our Service</li>
                                            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                                            <li><strong>Marketing Cookies:</strong> Used for targeted advertising and marketing campaigns</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Managing Cookies:</h3>
                                        <p className="mb-4">
                                            You can control cookies through your browser settings. However, disabling certain cookies may affect Service functionality. You can opt out of targeted advertising through industry tools like the Digital Advertising Alliance or Network Advertising Initiative.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">6. Data Security and Protection</h2>
                                        <p className="mb-4">
                                            We implement comprehensive security measures to protect your information:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Technical Safeguards:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Reasonable technical and organizational measures to protect data in transit and storage</li>
                                            <li>Use of secure infrastructure and access control mechanisms where appropriate</li>
                                            <li>Periodic reviews of system security and potential vulnerabilities</li>
                                            <li>Administrative access controls, which may include multi-factor authentication</li>
                                            <li>Monitoring systems designed to detect and respond to potential security incidents</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Administrative Safeguards:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Employee training on data protection and privacy</li>
                                            <li>Access controls and role-based permissions</li>
                                            <li>Incident response and breach notification procedures</li>
                                            <li>Regular security awareness training</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Physical Safeguards:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Secure data center facilities with controlled access</li>
                                            <li>Environmental controls and disaster recovery systems</li>
                                            <li>Regular backup and recovery testing</li>
                                        </ul>

                                        <p className="mb-4">
                                            <strong>Important Note:</strong> While we implement industry-standard security measures, no system is completely secure. You should use strong passwords, enable two-factor authentication, and avoid sharing sensitive information inappropriately.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">7. International Data Transfers</h2>
                                        <p className="mb-4">
                                            Aurix operates globally and may transfer your information to countries other than your own. When we transfer data internationally, we ensure appropriate safeguards are in place:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Adequacy decisions by relevant data protection authorities</li>
                                            <li>Standard contractual clauses approved by regulatory bodies</li>
                                            <li>Binding corporate rules for intra-group transfers</li>
                                            <li>Certification schemes and codes of conduct</li>
                                            <li>Your explicit consent where required</li>
                                        </ul>
                                        <p>
                                            Third-party service providers may also transfer data internationally in accordance with their own policies and applicable laws.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
                                        <p className="mb-4">
                                            We retain your information for as long as necessary to provide our Service and fulfill the purposes described in this Policy, unless a longer retention period is required by law.
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Retention Periods:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after account closure</li>
                                            <li><strong>Usage Logs:</strong> Typically retained for 12-24 months for security and debugging purposes</li>
                                            <li><strong>AI Training Data:</strong> May be retained longer for model improvement, subject to anonymization</li>
                                            <li><strong>Legal Hold:</strong> Data may be retained longer if required for legal proceedings or investigations</li>
                                            <li><strong>Backup Data:</strong> Retained according to our backup and disaster recovery policies</li>
                                        </ul>

                                        <p className="mb-4">
                                            You may request deletion of your personal data subject to legal and operational requirements. Some data may be retained in anonymized form for analytics and improvement purposes.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">9. Your Rights and Choices</h2>
                                        <p className="mb-4">
                                            Depending on your location and applicable law, you may have the following rights regarding your personal information:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Access and Portability:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Request access to your personal information</li>
                                            <li>Receive a copy of your data in a portable format</li>
                                            <li>Obtain information about how we process your data</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Correction and Updates:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Correct inaccurate or incomplete personal information</li>
                                            <li>Update your account information and preferences</li>
                                            <li>Modify your communication preferences</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Deletion and Restriction:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Request deletion of your personal information</li>
                                            <li>Restrict or object to processing in certain circumstances</li>
                                            <li>Withdraw consent where processing is consent-based</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Marketing Communications:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Opt out of marketing emails and promotional communications</li>
                                            <li>Control cookie preferences through browser settings</li>
                                            <li>Manage notification preferences in your account settings</li>
                                        </ul>

                                        <p className="mb-4">
                                            <strong>How to Exercise Your Rights:</strong> You can exercise these rights by contacting us using the information provided below. We will respond to your request within the timeframes required by applicable law.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">10. Children{"'"}s Privacy</h2>
                                        <p className="mb-4">
                                            Aurix is not intended for use by individuals under the age of 18 ({'"children"'} or {'"minors"'}). We do not knowingly collect personal information from children under 18.
                                        </p>
                                        <p className="mb-4">
                                            If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly. If you believe we have collected information from a child under 18, please contact us immediately.
                                        </p>
                                        <p>
                                            Parents and guardians should monitor their children{"'"}s online activities and help enforce our Terms and Conditions. We encourage parents to discuss online safety with their children.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">11. Third-Party Links and Services</h2>
                                        <p className="mb-4">
                                            Our Service may contain links to third-party websites, applications, or services that are not owned or controlled by us. This Privacy Policy does not apply to these third parties.
                                        </p>
                                        <p className="mb-4">
                                            We encourage you to read the privacy policies of any third-party services you use. We are not responsible for the privacy practices or content of third-party services.
                                        </p>
                                        <p>
                                            When you use third-party integrations through our Service (such as AI providers or cloud services), your data may be subject to both our Privacy Policy and the third party{"'"}s privacy policy.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">12. AI-Specific Privacy Considerations</h2>
                                        <p className="mb-4">
                                            Our use of artificial intelligence involves specific privacy considerations:
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Prompt and Output Processing:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Your prompts may be processed by multiple AI models for quality and accuracy</li>
                                            <li>AI outputs are generated based on patterns in training data, not personal information</li>
                                            <li>We may use your interactions to improve AI model performance</li>
                                            <li>AI-generated content may be logged for quality assurance and debugging</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Training Data:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Anonymized usage data may contribute to AI model training</li>
                                            <li>We implement measures to prevent personal information from being used in training</li>
                                            <li>We honor opt-out requests where technically feasible and within our
                                                control. Third-party AI providers process data according to their
                                                own policies.</li>
                                        </ul>

                                        <h3 className="text-lg font-medium mb-3">Bias and Fairness:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>AI models may reflect biases present in their training data</li>
                                            <li>We regularly audit AI outputs for fairness and accuracy</li>
                                            <li>You should independently verify AI-generated content for your use case</li>
                                        </ul>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">13. Changes to This Privacy Policy</h2>
                                        <p className="mb-4">
                                            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
                                        </p>
                                        <p className="mb-4">
                                            When we make material changes, we will:
                                        </p>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li>Update the {'"'}Last Updated{'"'} date at the bottom of this Policy</li>
                                            <li>Notify you through email or prominent notice on our Service</li>
                                            <li>Provide a summary of key changes</li>
                                            <li>Give you time to review the changes before they take effect</li>
                                        </ul>
                                        <p>
                                            Your continued use of our Service after the effective date of changes constitutes acceptance of the updated Privacy Policy. If you disagree with the changes, you may stop using our Service.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">14. Contact Us</h2>
                                        <p className="mb-4">
                                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                                        </p>
                                        <div className="bg-muted/50 p-4 rounded border mb-4">
                                            <p><strong>Email:</strong> 0xblackstack@gmail.com</p>
                                            <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                                            <p><strong>Data Protection Officer:</strong> Available for privacy-specific inquiries</p>
                                            <p><strong>Response Time:</strong> We aim to respond within 30 days for privacy-related requests</p>
                                        </div>

                                        <h3 className="text-lg font-medium mb-3">Data Protection Contacts:</h3>
                                        <ul className="list-disc list-inside mb-4 space-y-2">
                                            <li><strong>General Privacy Questions:</strong> 0xblackstack@gmail.com</li>
                                            <li><strong>Data Subject Rights:</strong> 0xblackstack@gmail.com</li>
                                            <li><strong>Security Incidents:</strong> 0xblackstack@gmail.com</li>
                                            <li><strong>Legal Notices:</strong> 0xblackstack@gmail.com</li>
                                        </ul>

                                        <p className="mb-4">
                                            <strong>Complaints:</strong> If you are not satisfied with our response to your privacy concerns, you have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.
                                        </p>
                                    </div>

                                    <div className="bg-card/50 p-6 rounded-lg border">
                                        <h2 className="text-xl font-semibold mb-4">15. Additional Disclosures</h2>

                                        <h3 className="text-lg font-medium mb-3">California Privacy Rights:</h3>
                                        <p className="mb-4">
                                            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA). Please refer to our California Privacy Notice for more information about these rights.
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">EU/UK GDPR Compliance:</h3>
                                        <p className="mb-4">
                                            For users in the European Union or United Kingdom, we comply with the General Data Protection Regulation (GDPR) and UK GDPR. Our Data Protection Officer can provide additional information about GDPR compliance.
                                        </p>

                                        <h3 className="text-lg font-medium mb-3">Do Not Track:</h3>
                                        <p className="mb-4">
                                            We do not currently respond to {'"'}Do Not Track{'"'} signals from browsers. However, you can control tracking through your browser settings and our cookie preferences.
                                        </p>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded border text-center">
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Last Updated:</strong> 30 December 2025
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            This Privacy Policy was last reviewed and updated to ensure compliance with current privacy laws and best practices, including GDPR, CCPA, and other applicable regulations.
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
