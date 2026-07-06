import { AnimatedShell } from "@/components/AnimatedShell";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function PageChrome({ children }: { children: React.ReactNode }) {
  return (
    <AnimatedShell>
      <Header />
      <main className="pt-[110px]">{children}</main>
      <Footer />
    </AnimatedShell>
  );
}
