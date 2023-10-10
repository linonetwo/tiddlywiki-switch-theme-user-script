// ==UserScript==
// @name          	Tiddlywiki Switch Theme
// @description     Auto switch theme of any public wiki that you are visiting. You can config which theme to switch to. Also auto switch to dark theme when your browser is in dark scheme.
// @version         0.0.1
// @icon https://tiddlywiki.com/favicon.ico
// @author			Lin Onetwo <https://github.com/linonetwo/wiki>
// @namespace       https://github.com/linonetwo
// @downloadURL		https://raw.github.com/linonetwo/tiddlywiki-switch-theme-user-script/master/tiddlywiki-switch-theme.user.js
// @updateURL		https://raw.github.com/linonetwo/tiddlywiki-switch-theme-user-script/master/tiddlywiki-switch-theme.user.js
// @supportURL		https://raw.github.com/linonetwo/tiddlywiki-switch-theme-user-script/issues
//
// @license         MIT
//
// @include         *://*
//
// @run-at			document-end
// @unwrap
// ==/UserScript==

/**
 * Wait until $tw exists, then modify the wiki.
 *
 * For user script APIs:
 * @see http://wiki.greasespot.net/API_reference
 * @see http://wiki.greasespot.net/Metadata_Block
 */
(function() {
  const config = {
    light: ['$:/palettes/Notion', '$:/palettes/Vanilla', '$:/palettes/SnowWhite'],
    dark: ['$:/palettes/Nord'],
  };

  let waitTwCounter = 0;
  const MAX_WAIT_TW_RETRY = 10;
  function waitTwLoaded() {
    if (waitTwCounter++ > MAX_WAIT_TW_RETRY) return;
    if (typeof $tw !== 'undefined') {
      onTwLoaded();
    } else {
      setTimeout(() => {
        waitTwLoaded();
      }, 100);
    }
  }
  waitTwLoaded();

  function onTwLoaded() {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addListener(e => {
     if (e.matches) {
      // Theme set to dark.
      switchTheme('dark');
     } else {
        // Theme set to preferred light, overwrite the palette choosed by author.
       switchTheme('light');
      }
    });
    if (darkThemeMq.matches) {
      switchTheme('dark');
    } else {
      switchTheme('light');
    }
  }

  function switchTheme(lightOrDark = 'light') {
    const validTheme = config[lightOrDark].filter(name => $tw.wiki.getTiddlerText(name))[0];
     if (validTheme) {
      $tw.wiki.addTiddler({ title: '$:/palette', ...$tw.wiki.getTiddler('$:/palette')?.fields, text: validTheme });
     }
  }
})();
