import { styleSheet as baseStyles } from './base';
import { styleSheet as loaderStyles } from './loader';
import { styleSheet as loaderPanelStyles } from './loader-panel';
import { styleSheet as canvasStyles } from './canvas';
import { styleSheet as navStyles } from './nav';
import { styleSheet as navEffectsStyles } from './nav-effects';
import { styleSheet as socialStyles } from './social';
import { styleSheet as socialEffectsStyles } from './social-effects';
import { styleSheet as sectionsStyles } from './sections';
import { styleSheet as heroStyles } from './hero';
import { styleSheet as heroTypingStyles } from './hero-typing';
import { styleSheet as contentStyles } from './content';
import { styleSheet as pinOutroStyles } from './pin-outro';
import { styleSheet as animationsStyles } from './animations';
import { styleSheet as responsiveStyles } from './responsive';
import { renderStyleSheet } from './renderer';

const homeStyles = [
  renderStyleSheet(baseStyles),
  renderStyleSheet(loaderStyles),
  renderStyleSheet(loaderPanelStyles),
  renderStyleSheet(canvasStyles),
  renderStyleSheet(navStyles),
  renderStyleSheet(navEffectsStyles),
  renderStyleSheet(socialStyles),
  renderStyleSheet(socialEffectsStyles),
  renderStyleSheet(sectionsStyles),
  renderStyleSheet(heroStyles),
  renderStyleSheet(heroTypingStyles),
  renderStyleSheet(contentStyles),
  renderStyleSheet(pinOutroStyles),
  renderStyleSheet(animationsStyles),
  renderStyleSheet(responsiveStyles),
].join('\n');

export function HomeStyles() {
  return <style>{homeStyles}</style>;
}
