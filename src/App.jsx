import { lazy, Suspense, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import PromoReel from "./components/PromoReel/PromoReel.jsx";
import Stats from "./components/Stats/Stats.jsx";
import WhyItMatters from "./components/WhyItMatters/WhyItMatters.jsx";
import Benefits from "./components/Benefits/Benefits.jsx";
import HowToExplore from "./components/HowToExplore/HowToExplore.jsx";
import Traditions from "./components/Traditions/Traditions.jsx";
import Testimonials from "./components/Testimonials/Testimonials.jsx";
import FAQ from "./components/FAQ/FAQ.jsx";
import FinalCTA from "./components/FinalCTA/FinalCTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import BooksModal from "./components/shared/BooksModal.jsx";
import PrivacyModal from "./components/shared/PrivacyModal.jsx";

const ShareMemoryModal = lazy(() => import("./components/shared/ShareMemoryModal.jsx"));

export default function App() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [booksModalOpen, setBooksModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const openPrivacy = () => setPrivacyModalOpen(true);
  const openShare = () => setShareModalOpen(true);

  return (
    <>
      <Header />
      <main>
        <Hero onOpenBooks={() => setBooksModalOpen(true)} />
        <PromoReel />
        <Stats />
        <WhyItMatters />
        <Benefits />
        <HowToExplore />
        <Traditions />
        <Testimonials onShareClick={openShare} />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer onOpenPrivacy={openPrivacy} />

      <BooksModal open={booksModalOpen} onClose={() => setBooksModalOpen(false)} />
      <PrivacyModal open={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />

      {shareModalOpen && (
        <Suspense fallback={null}>
          <ShareMemoryModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} onOpenPrivacy={openPrivacy} />
        </Suspense>
      )}

      <Analytics />
    </>
  );
}
