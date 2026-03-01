import { AboutSection } from "@/modules/widgets/about-section/about-section";
import { CTASection } from "@/modules/widgets/cta-section/cta-section";
import { HeroSection } from "@/modules/widgets/hero-section/hero-section";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <AboutSection />
            <CTASection />
        </div>
    );
}
