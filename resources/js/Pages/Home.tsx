import { Head } from '@inertiajs/react';
import { AboutSection } from './Home/components/AboutSection';
import { CareerSection } from './Home/components/CareerSection';
import { ContactSection } from './Home/components/ContactSection';
import { CursorLayers } from './Home/components/CursorLayers';
import { HeroSection } from './Home/components/HeroSection';
import { HomeNav } from './Home/components/HomeNav';
import { LoaderOverlay } from './Home/components/LoaderOverlay';
import { SocialDock } from './Home/components/SocialDock';
import { WhatIDoSection } from './Home/components/WhatIDoSection';
import { HomeSceneProvider } from './Home/context/HomeSceneContext';
import { TITLES } from './Home/constants/content';
import { useHomeScene } from './Home/hooks/useHomeScene';
import { useTyping } from './Home/hooks/useTyping';
import { HomeStyles } from '../styles/home';

export default function Home() {
  const scene = useHomeScene();
  const typed = useTyping(TITLES);

  return (
    <>
      <Head title="Ellis Threader | 3D Scroll Experience" />
      <HomeStyles />

      <HomeSceneProvider value={scene}>
        <LoaderOverlay />
        <CursorLayers />
        <SocialDock />

        <main ref={scene.pageRef} className={`scroll-page ${scene.isIntroComplete ? 'is-ready' : 'is-preloading'}`}>
          <HomeNav />
          <HeroSection typed={typed} />
          <AboutSection />
          <WhatIDoSection />
          <CareerSection />
          <ContactSection />
        </main>
      </HomeSceneProvider>
    </>
  );
}
