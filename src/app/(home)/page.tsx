"use client";

import { useEffect, useState } from "react";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/project-list";
import Image from "next/image";
import { toast } from "sonner";
import SplitText from "@/components/SplitText";
import Aurora from '@/components/Aurora';
import "./pixelSnow.css"
import { motion } from "framer-motion";
import PixelSnow from '@/components/PixelSnow';

// Component added by Ansh - github.com/ansh-dhanani

import GradualBlur from '@/components/GradualBlur';
import { useTheme } from "next-themes";
import Link from "next/link";
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

  const snowColor = "#ffffff";


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

        {mounted && isSmall && (
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
              <motion.section
                className="space-y-6 py-[16vh] pt-[1vh] 2xl:py-48"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Aurix"
                    width={75}
                    height={75}
                    className="hidden md:block"
                    priority
                  />
                </motion.div>

                <motion.div
                  className="flex justify-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <SplitText
                    text="Build something meaningful with Aurix"
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
                </motion.div>

                <motion.p
                  className="text-lg md:text-xl text-muted-foreground text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Create websites and applications without technical complexity.
                </motion.p>

                <div className="max-w-3xl mx-auto w-full">
                  <ProjectForm />
                </div>
              </motion.section>

              <ProjectsList />

              <br />
              <br />
            </div>

            <br />
            <br />

            <motion.p
              className="text-muted-foreground text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              UI effects powered by ReactBits
            </motion.p>

            <motion.footer
              className="flex gap-4 justify-center text-sm text-muted-foreground mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Link href={"/terms"} className="hover:text-foreground transition-colors cursor-target">
                Terms And Conditions
              </Link>

              <Link href={"/privacy"} className="hover:text-foreground transition-colors cursor-target">
                Privacy Policy
              </Link>
            </motion.footer>
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
