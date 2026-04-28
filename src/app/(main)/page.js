import HeroSection from "@/components/home/HeroSection";
import FeatureList from "@/components/home/FeatureList";
import ImpactSection from "@/components/home/ImpactSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureList />
      <ImpactSection />
    </div>
  );
}
