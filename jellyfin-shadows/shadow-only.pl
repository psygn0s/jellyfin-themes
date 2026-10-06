(function () {
  'use strict';

  const KEY = '__JF_SHADOWS_V1__';

  if (window[KEY]) {
    console.log('[JF Shadows] Already running — EXIT');
    return;
  }

  window[KEY] = true;

  console.log('[JF Shadows] STARTED');


  /* =========================================================
     POSTER SHADOW — EDIT THESE
  ========================================================= */

  const POSTER_SHADOW_X = 0;
  const POSTER_SHADOW_Y = 12;
  const POSTER_SHADOW_BLUR = 24;
  const POSTER_SHADOW_SPREAD = 4;
  const POSTER_SHADOW_OPACITY = 0.75;


  /* =========================================================
     RIBBON SHADOW — EDIT THESE
  ========================================================= */

  const RIBBON_SHADOW_BOTTOM = -3;
  const RIBBON_SHADOW_HEIGHT = 4;
  const RIBBON_SHADOW_BLUR = 3;
  const RIBBON_SHADOW_OPACITY = 0.25;


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
        return poster.parentElement?.parentElement?.parentElement || null;
      }
    }

    return null;
  }


  /* =========================================================
     POSTER DROP SHADOW
  ========================================================= */

  function applyPosterShadow(itemId) {

    if (getItemId() !== itemId) {
      return;
    }

    const card =
      getCurrentCard(itemId);

    if (!card) {

      setTimeout(function () {
        applyPosterShadow(itemId);
      }, 250);

      return;
    }

    card.style.setProperty(
      'box-shadow',
      `${POSTER_SHADOW_X}px ${POSTER_SHADOW_Y}px ${POSTER_SHADOW_BLUR}px ${POSTER_SHADOW_SPREAD}px rgba(0, 0, 0, ${POSTER_SHADOW_OPACITY})`,
      'important'
    );

    console.log(
      '[JF Shadows] POSTER SHADOW APPLIED'
    );
  }


  /* =========================================================
     RIBBON DROP SHADOW
  ========================================================= */

  function applyRibbonShadow() {

    const ribbon =
      document.querySelector('.detailRibbon');

    if (!ribbon) {

      setTimeout(
        applyRibbonShadow,
        250
      );

      return;
    }

    ribbon.style.setProperty(
      'position',
      'relative',
      'important'
    );

    let shadow =
      ribbon.querySelector(':scope > .jf-ribbon-shadow');

    if (!shadow) {

      shadow =
        document.createElement('div');

      shadow.className =
        'jf-ribbon-shadow';

      shadow.style.setProperty(
        'position',
        'absolute',
        'important'
      );

      shadow.style.setProperty(
        'left',
        '0',
        'important'
      );

      shadow.style.setProperty(
        'right',
        '0',
        'important'
      );

      shadow.style.setProperty(
        'bottom',
        `${RIBBON_SHADOW_BOTTOM}px`,
        'important'
      );

      shadow.style.setProperty(
        'height',
        `${RIBBON_SHADOW_HEIGHT}px`,
        'important'
      );

      shadow.style.setProperty(
        'background',
        `rgba(0, 0, 0, ${RIBBON_SHADOW_OPACITY})`,
        'important'
      );

      shadow.style.setProperty(
        'filter',
        `blur(${RIBBON_SHADOW_BLUR}px)`,
        'important'
      );

      shadow.style.setProperty(
        'pointer-events',
        'none',
        'important'
      );

      shadow.style.setProperty(
        'z-index',
        '-1',
        'important'
      );

      ribbon.appendChild(shadow);
    }

    console.log(
      '[JF Shadows] RIBBON SHADOW APPLIED'
    );
  }


  /* =========================================================
     APPLY ALL SHADOWS
  ========================================================= */

  function applyShadows() {

    const itemId =
      getItemId();

    if (itemId) {
      applyPosterShadow(itemId);
    }

    applyRibbonShadow();
  }


  /* =========================================================
     ROUTE MONITOR
  ========================================================= */

  let lastUrl =
    location.href;

  setInterval(function () {

    const url =
      location.href;

    if (url === lastUrl) {
      return;
    }

    lastUrl = url;

    console.log(
      '[JF Shadows] URL CHANGED'
    );

    applyShadows();

  }, 100);


  /* =========================================================
     INITIALIZE
  ========================================================= */

  applyShadows();

})();
