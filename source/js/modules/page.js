export const ThemeColor = {
  PURPLE: `theme-purple`,
  BLUE: `theme-blue`,
  BLUE_DARK: `theme-blue-dark`,
  PURPLE_DARK: `theme-purple-dark`,
};

const ThemeColorValues = new Set(Object.values(ThemeColor));

export default () => {
  function ready() {
    document.body.classList.add(`dom-loaded`);
  }

  function themeChange({detail: {theme}}) {
    clearThemes();
    if (ThemeColorValues.has(theme)) {
      document.body.classList.add(theme);
    }
  }

  function clearThemes() {
    document.body.classList.remove(...Array.from(ThemeColorValues.values()));
  }

  function screenChanged() {
    clearThemes();
  }

  document.addEventListener(`DOMContentLoaded`, ready);
  document.body.addEventListener(`themeChange`, themeChange);
  document.body.addEventListener(`screenChanged`, screenChanged);
};
