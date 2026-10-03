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
    '0 12px 24px 4px rgba(0, 0, 0, 0.75)',
      'important'
    );

    state.shadowCard = card;

    console.log(
      '[RibbonColor] POSTER SHADOW APPLIED'
    );
  }


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

    ribbon.style.setProperty(
      'background',
      `rgba(${rgb}, 0.55)`,
      'important'
    );

    ribbon.style.setProperty(
      'opacity',
      '1',
      'important'
    );

    console.log(
      '[RibbonColor] APPLIED:',
      rgb
    );
  }


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
            brightness < 30 ||
            brightness > 220
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


        const rgb =
          Math.round(r / count) +
          ', ' +
          Math.round(g / count) +
          ', ' +
          Math.round(b / count);


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


  handleItem(
    getItemId()
  );

})();
