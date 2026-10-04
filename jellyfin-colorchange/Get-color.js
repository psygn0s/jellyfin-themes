
(function () {
  'use strict';

  const KEY = '__JF_RIBBON_COLOR_V5__';

  if (window[KEY]) {
    console.log('[RibbonColor] V5 already running — EXIT');
    return;
  }

  const state = window[KEY] = {
    itemId: null,
    colors: new Map(),
    loading: new Set(),
    lastUrl: location.href,
    shadowCard: null
  };

  console.log('[RibbonColor] V5 STARTED');


  /* =========================================================
     IMPORTANT CONTROLS – EDIT THESE
  ========================================================= */

  /* Ribbon opacity
     1.00 = completely opaque
     0.90 = current
     0.75 = more transparent
     0.50 = very transparent
  */
  const RIBBON_OPACITY = 0.90;


  /* Brightness
     1.00 = unchanged
     1.10 = 10% brighter
     0.90 = 10% darker
     0.75 = noticeably darker
  */
  const BRIGHTNESS = 1.00;


  /* Saturation
     1.00 = unchanged
     1.20 = more saturated
     1.50 = much more saturated
     0.80 = slightly muted
     0.50 = heavily muted
  */
  const SATURATION = 1.00;


  /* Hue shift
     0 = unchanged
     30 = shift 30 degrees
     60 = shift 60 degrees
     -30 = shift 30 degrees the other direction
     180 = opposite color
  */
  const HUE_SHIFT = 7;


  /* =========================================================
     POSTER SHADOW – EDIT THESE IF NEEDED
  ========================================================= */

  const SHADOW_X = 0;
  const SHADOW_Y = 12;
  const SHADOW_BLUR = 24;
  const SHADOW_SPREAD = 4;
  const SHADOW_OPACITY = 0.75;


  /* =========================================================
     HELPERS
  ========================================================= */


  function getItemId() {

    const match =
      location.hash.match(/[?&]id=([^&]+)/);

    return match
      ? decodeURIComponent(match[1])
      : null;
  }


  function getVisibleRibbon() {

    const ribbons = [
      ...document.querySelectorAll('.detailRibbon')
    ];

    for (const ribbon of ribbons) {

      const rect =
        ribbon.getBoundingClientRect();

      if (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      ) {
        return ribbon;
      }
    }

    return null;
  }


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
     COLOR CONVERSION
  ========================================================= */


  function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;

    if (max !== min) {

      const d = max - min;

      s =
        l > 0.5
          ? d / (2 - max - min)
          : d / (max + min);

      switch (max) {

        case r:
          h =
            (g - b) / d +
            (g < b ? 6 : 0);
          break;

        case g:
          h =
            (b - r) / d + 2;
          break;

        case b:
          h =
            (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100
    };
  }


  function hueToRgb(p, q, t) {

    if (t < 0) t += 1;
    if (t > 1) t -= 1;

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
      return q;
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  }


  function hslToRgb(h, s, l) {

    h /= 360;
    s /= 100;
    l /= 100;

    let r;
    let g;
    let b;

    if (s === 0) {

      r = l;
      g = l;
      b = l;

    } else {

      const q =
        l < 0.5
          ? l * (1 + s)
          : l + s - l * s;

      const p =
        2 * l - q;

      r =
        hueToRgb(
          p,
          q,
          h + 1 / 3
        );

      g =
        hueToRgb(
          p,
          q,
          h
        );

      b =
        hueToRgb(
          p,
          q,
          h - 1 / 3
        );
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }


  function adjustColor(rgb) {

    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;

    const hsl =
      rgbToHsl(r, g, b);


    /* Hue */
    hsl.h =
      (hsl.h + HUE_SHIFT) % 360;

    if (hsl.h < 0) {
      hsl.h += 360;
    }


    /* Saturation */
    hsl.s *= SATURATION;

    hsl.s =
      Math.max(
        0,
        Math.min(100, hsl.s)
      );


    /* Brightness */
    hsl.l *= BRIGHTNESS;

    hsl.l =
      Math.max(
        0,
        Math.min(100, hsl.l)
      );


    return hslToRgb(
      hsl.h,
      hsl.s,
      hsl.l
    );
  }


  /* =========================================================
     POSTER SHADOW
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

    if (
      state.shadowCard &&
      state.shadowCard !== card
    ) {
      state.shadowCard.style.removeProperty(
        'box-shadow'
      );
    }

    card.style.setProperty(
      'box-shadow',
      `${SHADOW_X}px ${SHADOW_Y}px ${SHADOW_BLUR}px ${SHADOW_SPREAD}px rgba(0, 0, 0, ${SHADOW_OPACITY})`,
      'important'
    );

    state.shadowCard = card;

    console.log(
      '[RibbonColor] POSTER SHADOW APPLIED'
    );
  }


  /* =========================================================
     RIBBON COLOR
  ========================================================= */


  function applyColor(rgb, itemId) {

    if (getItemId() !== itemId) {
      return;
    }

    const ribbon =
      getVisibleRibbon();

    if (!ribbon) {

      setTimeout(function () {
        applyColor(rgb, itemId);
      }, 250);

      return;
    }


    const adjusted =
      adjustColor(rgb);


    const adjustedRgb =
      `${adjusted.r}, ${adjusted.g}, ${adjusted.b}`;


    ribbon.style.setProperty(
      'background',
      `rgba(${adjustedRgb}, ${RIBBON_OPACITY})`,
      'important'
    );


    console.log(
      '[RibbonColor] APPLIED:',
      adjustedRgb
    );
  }


  /* =========================================================
     EXTRACT POSTER COLOR
  ========================================================= */


  async function extractColor(itemId) {

    if (state.loading.has(itemId)) {
      return;
    }

    if (state.colors.has(itemId)) {

      const rgb =
        state.colors.get(itemId);

      applyColor(
        rgb,
        itemId
      );

      applyPosterShadow(
        itemId
      );

      return;
    }

    state.loading.add(itemId);

    const url =
      location.origin +
      '/Items/' +
      encodeURIComponent(itemId) +
      '/Images/Primary';

    console.log(
      '[RibbonColor] PRIMARY:',
      url
    );

    try {

      const response =
        await fetch(
          url,
          {
            credentials: 'include'
          }
        );

      if (!response.ok) {
        throw new Error(
          'HTTP ' + response.status
        );
      }

      const blob =
        await response.blob();

      if (getItemId() !== itemId) {

        state.loading.delete(itemId);
        return;
      }

      const blobUrl =
        URL.createObjectURL(blob);

      try {

        const img =
          new Image();

        await new Promise(
          function (resolve, reject) {

            img.onload = resolve;
            img.onerror = reject;
            img.src = blobUrl;

          }
        );


        const size = 32;

        const canvas =
          document.createElement(
            'canvas'
          );

        canvas.width = size;
        canvas.height = size;

        const ctx =
          canvas.getContext(
            '2d',
            {
              willReadFrequently: true
            }
          );

        ctx.drawImage(
          img,
          0,
          0,
          size,
          size
        );


        const pixels =
          ctx.getImageData(
            0,
            0,
            size,
            size
          ).data;


        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;


        for (
          let i = 0;
          i < pixels.length;
          i += 4
        ) {

          const red =
            pixels[i];

          const green =
            pixels[i + 1];

          const blue =
            pixels[i + 2];


          const brightness =
            (red + green + blue) / 3;


          if (
            brightness < 0 ||
            brightness > 255
          ) {
            continue;
          }


          r += red;
          g += green;
          b += blue;

          count++;
        }


        if (!count) {
          throw new Error(
            'No usable pixels'
          );
        }


        const rgb = {
          r: Math.round(r / count),
          g: Math.round(g / count),
          b: Math.round(b / count)
        };


        state.colors.set(
          itemId,
          rgb
        );

        state.loading.delete(
          itemId
        );


        console.log(
          '[RibbonColor] COLOR:',
          rgb
        );


        applyColor(
          rgb,
          itemId
        );

        applyPosterShadow(
          itemId
        );

      } finally {

        URL.revokeObjectURL(
          blobUrl
        );
      }

    } catch (error) {

      state.loading.delete(
        itemId
      );

      console.error(
        '[RibbonColor] ERROR:',
        error
      );
    }
  }


  /* =========================================================
     ITEM / ROUTE HANDLING
  ========================================================= */


  function handleItem(itemId) {

    if (!itemId) {
      return;
    }

    if (itemId === state.itemId) {

      applyPosterShadow(
        itemId
      );

      return;
    }


    if (state.shadowCard) {

      state.shadowCard.style.removeProperty(
        'box-shadow'
      );

      state.shadowCard = null;
    }


    state.itemId = itemId;

    console.log(
      '[RibbonColor] NEW ITEM:',
      itemId
    );


    if (state.colors.has(itemId)) {

      const rgb =
        state.colors.get(itemId);

      applyColor(
        rgb,
        itemId
      );

      applyPosterShadow(
        itemId
      );

      return;
    }


    extractColor(
      itemId
    );
  }


  /* =========================================================
     ROUTE MONITOR
  ========================================================= */


  setInterval(function () {

    const url =
      location.href;

    if (url === state.lastUrl) {
      return;
    }

    state.lastUrl = url;

    const itemId =
      getItemId();

    console.log(
      '[RibbonColor] URL CHANGED:',
      itemId
    );

    handleItem(
      itemId
    );

  }, 100);


  /* =========================================================
     START
  ========================================================= */

  handleItem(
    getItemId()
  );

})();
