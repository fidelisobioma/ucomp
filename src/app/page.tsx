import HomeNavbar from "@/components/home/navbar";
import Hero from "@/components/home/hero";
import Tutorial from "@/components/home/tutorial";
import Features from "@/components/home/features";
import Services from "@/components/home/services";
import Pricing from "@/components/home/pricing";
import FAQ from "@/components/home/faq";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <main>
      <HomeNavbar />
      <Hero />
      <Tutorial />
      <Features />
      <Services />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
