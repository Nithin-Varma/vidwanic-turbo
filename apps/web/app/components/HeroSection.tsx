import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";

const HeroSection = () => (
  <section className="w-full bg-[#edf0f2] py-12 md:py-24">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-8 gap-10 md:gap-16">
      {/* Left: Text */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-lg md:max-w-xl">
        <h1 className="font-bold text-4xl md:text-6xl leading-tight mb-4">
          Best Educational<br className="hidden md:block" />
          Magazines
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-md md:max-w-none">
          Our non-revenue sales team ensures the sales process runs smoothly and efficiently
        </p>
        <Button className="bg-[#ff5a09] hover:bg-[#e04e00] text-white text-lg font-bold px-8 py-3 rounded-md shadow-md transition-colors">
          LEARN MORE
        </Button>
      </div>
      {/* Right: Image */}
      <div className="flex-1 flex justify-center md:justify-end w-full max-w-xs md:max-w-md lg:max-w-lg">
        <Image
          src="/heroimage.svg"
          alt="Children reading Vidwanic Magazine"
          width={500}
          height={400}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  </section>
);

export default HeroSection; 