(function () {
  'use strict';

  const KEY = '__JF_DETAIL_TWEAKS_V9__';

  if (window[KEY]) {
    console.log('[DetailTweaks] already running — EXIT');
    return;
  }

  window[KEY] = true;

  console.log('[DetailTweaks] V9 STARTED');


  /* =========================================================
     RIBBON COLOR + BORDER – EDIT THESE
     Color: any CSS color works: 'rgba(23, 23, 23, 0.6)', '#1a1a1a',
     'rgb(40, 20, 60)'. Last number in rgba is opacity (0 to 1).
     Set to '' to leave the ribbon color alone.

     Border: any CSS border value: '1px solid #8a8a8a',
     '1px solid rgba(255, 255, 255, 0.25)'. Set to '' for no border.
  ========================================================= */

  const RIBBON_COLOR = 'rgba(28, 28, 28, 0.8)';
  const RIBBON_BORDER = '1px solid rgba(50, 50, 50, 1.0)';


  /* =========================================================
     POSTER SHADOW – EDIT THESE
  ========================================================= */

  const POSTER_SHADOW_X = 1;
  const POSTER_SHADOW_Y = 1;
  const POSTER_SHADOW_BLUR = 20;
  const POSTER_SHADOW_SPREAD = 8.0;
  const POSTER_SHADOW_OPACITY = 0.20;


  /* =========================================================
     RIBBON SHADOW – EDIT THESE
     Note: the opacity is used as rgba(0, 0, 0, <value>), so any
     value of 1 or more is fully opaque. Use 0.5 for 50%.
  ========================================================= */

  const RIBBON_SHADOW_BOTTOM = -5;
  const RIBBON_SHADOW_HEIGHT = 30;
  const RIBBON_SHADOW_BLUR = 22;
  const RIBBON_SHADOW_OPACITY = 0.6;


  /* =========================================================
     STATE
  ========================================================= */

  let lastUrl = location.href;
  let posterCard = null;


  /* =========================================================
     HELPERS
  ========================================================= */

  function getItemId() {
    const match = location.hash.match(/[?&]id=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }


  function getCurrentCard(itemId) {
    if (!itemId) {
      return null;
    }

    const posters = document.querySelectorAll(
      '.detailPageWrapperContainer .cardImageContainer'
    );

    const target = '/Items/' + itemId + '/';

    for (const poster of posters) {
      const background = getComputedStyle(poster).backgroundImage;

      if (background && background.includes(target)) {
        return poster.parentElement?.parentElement?.parentElement || null;
      }
    }

    return null;
  }


  /* =========================================================
     POSTER DROP SHADOW
  ========================================================= */

  function applyPosterShadow() {
    const itemId = getItemId();

    if (!itemId) {
      return false;
    }

    const card = getCurrentCard(itemId);

    if (!card) {
      return false;
    }

    if (posterCard && posterCard !== card) {
      posterCard.style.removeProperty('box-shadow');
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
     RIBBON COLOR + BORDER + SHADOW CSS
     Injected as a stylesheet (with a pseudo-element for the
     shadow) so it survives Jellyfin rebuilding the ribbon.
  ========================================================= */

  function installRibbonShadowCSS() {
    const STYLE_ID = 'jf-ribbon-shadow-style';

    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');

    style.id = STYLE_ID;
    style.textContent = `
      .detailRibbon {
        position: relative !important;
        box-sizing: border-box !important;
        ${RIBBON_COLOR ? `background: ${RIBBON_COLOR} !important;` : ''}
        ${RIBBON_BORDER ? `border: ${RIBBON_BORDER} !important;` : ''}
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

    console.log('[DetailTweaks] RIBBON CSS INSTALLED');
  }


  /* =========================================================
     EMPTY BOX MARKER
     Adds .jf-empty to a framed box that has no visible content, so
     the CSS can drop its background, border, padding and margins.
  ========================================================= */

  const FRAME_SELECTOR =
    '.itemDetailsGroup, .itemTags, .trackSelections, ' +
    '.detailSectionContent > .overview';

  const CONTROL_SELECTOR = 'select, img, button, input, svg, canvas, video';

  function hasVisibleContent(el) {
    /* innerText ignores anything hidden with display: none */
    if ((el.innerText || '').trim() !== '') {
      return true;
    }

    /* Controls and images with no text (dropdowns, icons, etc.) */
    const controls = el.querySelectorAll(CONTROL_SELECTOR);

    for (const node of controls) {
      if (node.getClientRects().length > 0) {
        return true;
      }
    }

    return false;
  }


  function markEmptyFrames() {
    document.querySelectorAll(FRAME_SELECTOR).forEach(function (el) {
      const empty = !hasVisibleContent(el);

      /* Only touch the DOM when the state changes, so the observer
         below doesn't keep re-triggering itself. */
      if (el.classList.contains('jf-empty') !== empty) {
        el.classList.toggle('jf-empty', empty);
      }
    });
  }


  /* =========================================================
     APPLY EVERYTHING (debounced)
  ========================================================= */

  function apply() {
    installRibbonShadowCSS();
    applyPosterShadow();
    markEmptyFrames();
  }


  let applyTimer = null;

  function scheduleApply() {
    if (applyTimer) {
      return;
    }

    applyTimer = setTimeout(function () {
      applyTimer = null;
      apply();
    }, 100);
  }


  /* =========================================================
     ROUTE HANDLING
  ========================================================= */

  function checkRoute() {
    const url = location.href;

    if (url === lastUrl) {
      return;
    }

    lastUrl = url;

    if (posterCard) {
      posterCard.style.removeProperty('box-shadow');
      posterCard = null;
    }

    console.log('[DetailTweaks] NEW PAGE:', getItemId());

    scheduleApply();
  }


  window.addEventListener('hashchange', checkRoute);

  /* Fallback in case a navigation doesn't fire hashchange */
  setInterval(checkRoute, 250);


  /* =========================================================
     DOM OBSERVER
     One observer for everything. Only structure and class changes
     are watched; the script's own style edits don't re-trigger it.
  ========================================================= */

  new MutationObserver(scheduleApply).observe(
    document.body || document.documentElement,
    {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class']
    }
  );


  /* =========================================================
     START
  ========================================================= */

  apply();

})();
