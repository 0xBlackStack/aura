"use client";

import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";
import { motion } from "framer-motion";

const Page = () => {
    const currentTheme = useCurrentTheme();

    return (
        <motion.div 
            className="flex flex-col max-w-3xl mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.section 
                className="space-y-6 pt-[16vh] 2xl:pt-48"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Image
                        src={"/logo.png"}
                        alt="Aurix"
                        width={50}
                        height={50}
                        className="hidden md:block"
                    />
                </motion.div>
                <motion.h1 
                    className="text-xl md:text-3xl font-bold text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Pricing
                </motion.h1>
                <motion.p 
                    className="text-muted-foreground text-center text-sm md:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Choose the plan that&apos;s right for you and start building with Aurix today.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <PricingTable
                        appearance={{
                            baseTheme: currentTheme === "dark" ? dark : undefined,
                            elements: {
                                pricingTableCard: "border! shadow-none! rounded-lg!"
                            }
                        }}
                    />
                </motion.div>
            </motion.section>
        </motion.div>
    )
}

export default Page;
