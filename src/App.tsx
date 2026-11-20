import { useState } from 'react';
import { Banner, Hero } from './components/Hero';
import { Features } from './components/Features';
import { Keyboard } from './components/Keyboard';
import { Details, Faq, Footer, GetAnti, LeftOut, Privacy, Themes } from './components/Sections';
import { DEFAULT_THEME, THEMES } from './lib/themes';

export default function App() {
  // one theme for both window drawings: picking a preset recolors the hero window too
  const [theme, setTheme] = useState(DEFAULT_THEME);
  return (
    <div className="page">
      <div className="frame">
        <Hero theme={THEMES[theme]} />
        <Banner />
        <Features />
        <Keyboard />
        <Themes current={theme} onPick={setTheme} />
        <Details />
        <Privacy />
        <LeftOut />
        <GetAnti />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
