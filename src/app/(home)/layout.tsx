import { NavBar } from "@/modules/home/ui/components/navbar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <NavBar />
            {/* Background */}
            <div
                className="
          absolute inset-0 -z-10
          bg-background
          bg-[radial-gradient(#d1d5db_1px,transparent_1px)]
          dark:bg-[#0b0e14]
          dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]
          bg-size-[20px_20px]
        "
            />

            {/* Content */}
            <div className="relative flex min-h-screen flex-col px-4 pb-4">
                {children}
            </div>
        </main>
    );
};

export default Layout;
