import HeroSection from "@/components/home/HeroSection";
import FeatureList from "@/components/home/FeatureList";
import ImpactSection from "@/components/home/ImpactSection";
import DonationSteps from "@/components/home/DonationSteps";
import AmertaTips from "@/components/home/AmertaTips";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureList />
      <DonationSteps />
      <AmertaTips />
      <ImpactSection />
    </div>
  );
}
