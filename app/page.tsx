import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Programs } from "@/components/landing/Programs";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Hero />
                <Programs />
            </main>
            <Footer />
        </div>
    );
}
