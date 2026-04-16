import { HeroScanner } from "@/components/scanner/hero-scanner";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-12 md:pt-16">
      <div className="w-full max-w-2xl">
        <HeroScanner />
      </div>
    </div>
  );
}
