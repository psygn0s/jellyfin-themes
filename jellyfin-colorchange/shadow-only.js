(function () {
  'use strict';

  const KEY = '__JF_SHADOWS_V4__';

  if (window[KEY]) {
    console.log('[JF Shadows] Already running — EXIT');
    return;
  }

  window[KEY] = true;

  console.log('[JF Shadows] STARTED');


  /* =========================================================
     POSTER SHADOW — EDIT THESE
  ========================================================= */

  const POSTER_SHADOW_X = 2;
  const POSTER_SHADOW_Y = 2;
  const POSTER_SHADOW_BLUR = 35;
  const POSTER_SHADOW_SPREAD = 4.5;
  const POSTER_SHADOW_OPACITY = 0.45;


  /* =========================================================
     RIBBON SHADOW — EDIT THESE
  ========================================================= */

  const RIBBON_SHADOW_BOTTOM = -10;
  const RIBBON_SHADOW_HEIGHT = 20;
  const RIBBON_SHADOW_BLUR = 25;
  const RIBBON_SHADOW_OPACITY = 50;



  /* =========================================================
     STATE
  ========================================================= */

  let lastUrl = location.href;
  let posterCard = null;


  /* =========================================================
     GET CURRENT ITEM ID
  ========================================================= */

  function getItemId() {

    const match =
      location.hash.match(/[?&]id=([^&]+)/);

    return match
      ? decodeURIComponent(match[1])
      : null;
  }


  /* =========================================================
     FIND CURRENT POSTER CARD
  ========================================================= */

  function getCurrentCard(itemId) {

    if (!itemId) {
      return null;
    }

    const posters =
      document.querySelectorAll(
        '.detailPageWrapperContainer .cardImageContainer'
      );

    const target =
      '/Items/' + itemId + '/';

    for (const poster of posters) {

      const background =
        getComputedStyle(poster).backgroundImage;

      if (
        background &&
        background.includes(target)
      ) {
        return (
          poster.parentElement?.parentElement?.parentElement
          || null
        );
      }
    }

    return null;
  }


  /* =========================================================
     POSTER DROP SHADOW
  ========================================================= */

  function applyPosterShadow() {

    const itemId =
      getItemId();

    if (!itemId) {
      return false;
    }

    const card =
      getCurrentCard(itemId);

    if (!card) {
      return false;
    }

    if (
      posterCard &&
      posterCard !== card
    ) {
      posterCard.style.removeProperty(
        'box-shadow'
      );
    }

    card.style.setProperty(
      'box-shadow',
      `${POSTER_SHADOW_X}px ${POSTER_SHADOW_Y}px ${POSTER_SHADOW_BLUR}px ${POSTER_SHADOW_SPREAD}px rgba(0, 0, 0, ${POSTER_SHADOW_OPACITY})`,
      'important'
    );

    posterCard = card;

    return true;
  }


  /* =========================================================
     RIBBON SHADOW CSS
     Inject the shadow as a CSS pseudo-element.
     Jellyfin can rebuild the ribbon without removing it.
  ========================================================= */

  function installRibbonShadowCSS() {

    const STYLE_ID =
      'jf-ribbon-shadow-style';

    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }

    const style =
      document.createElement('style');

    style.id =
      STYLE_ID;
    style.textContent = `
      .detailRibbon {
        position: relative !important;
      }

      .detailRibbon::after {
        content: "" !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: ${RIBBON_SHADOW_BOTTOM}px !important;
        height: ${RIBBON_SHADOW_HEIGHT}px !important;
        background: rgba(0, 0, 0, ${RIBBON_SHADOW_OPACITY}) !important;
        filter: blur(${RIBBON_SHADOW_BLUR}px) !important;
        pointer-events: none !important;
        z-index: -1 !important;
      }
    `;


    document.head.appendChild(style);

    console.log(
      '[JF Shadows] RIBBON SHADOW CSS INSTALLED'
    );
  }


  /* =========================================================
     APPLY
  ========================================================= */

  function apply() {

    installRibbonShadowCSS();
    applyPosterShadow();
  }


  /* =========================================================
     ROUTE MONITOR
  ========================================================= */

  setInterval(function () {

    const url =
      location.href;

    if (url !== lastUrl) {

      lastUrl = url;

      if (posterCard) {

        posterCard.style.removeProperty(
          'box-shadow'
        );

        posterCard = null;
      }

      console.log(
        '[JF Shadows] NEW PAGE:',
        getItemId()
      );
    }

    apply();

  }, 250);


  /* =========================================================
     DOM OBSERVER
  ========================================================= */

  const observer =
    new MutationObserver(function () {

      apply();

    });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );


  /* =========================================================
     INITIAL STARTUP
  ========================================================= */

  apply();

})();
