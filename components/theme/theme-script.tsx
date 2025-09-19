const THEME_STORAGE_KEY = "veilcraft:theme";

export function ThemeScript() {
  const scriptContent = `
    (function() {
      try {
        var storageKey = "${THEME_STORAGE_KEY}";
        var stored = window.localStorage.getItem(storageKey);
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        var theme = stored === 'light' || stored === 'dark'
          ? stored
          : (prefersLight ? 'light' : 'dark');
        var root = document.documentElement;
        root.dataset.theme = theme;
        if (document.body) {
          document.body.setAttribute('data-theme', theme);
        }
      } catch (error) {
        document.documentElement.dataset.theme = 'dark';
      }
    })();
  `;

  return <script id="veilcraft-theme-script" dangerouslySetInnerHTML={{ __html: scriptContent }} />;
}
