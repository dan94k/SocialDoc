import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import PdfPreview from "@/components/landing/pdf-preview";
import Pricing from "@/components/landing/pricing";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <PdfPreview />
      <Pricing />
      <Footer />
    </main>
  );
}
