import { AuroraBackground } from "@/components/ui/aurora-background";

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground
      variant="ocean"
      className="flex h-[400px] w-full items-center justify-center rounded-xl"
      childrenClassName="flex flex-col items-center justify-center gap-4 text-center px-6"
    >
      <h1 className="text-4xl font-bold text-slate-900 drop-shadow-md md:text-6xl">
        Smile7 Dental Clinic
      </h1>
      <p className="max-w-md text-lg text-slate-700">
        Precision dental care with living animated aurora background.
      </p>
    </AuroraBackground>
  );
}
