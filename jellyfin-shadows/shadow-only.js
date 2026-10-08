/* =========================================================
   HEADER
========================================================= */
.detailLogo {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 30% center;
  height: 16vh;
  width: 25vw;
  position: absolute;
  right: 3vw;
  top: 4vh;
}
.sidebarHeader {
  color: #00a4dc;
}
/* =========================================================
   CARDS / ITEMS
========================================================= */
.layout-desktop .itemsContainer .card .cardBox {
  margin: 1em;
  transition: transform 0.2s;
}
.layout-desktop .itemsContainer .card:hover .cardBox {
  transform: scale(1.1);
}
.layout-desktop .itemsContainer .card .cardOverlayContainer {
  background: unset;
}
.layout-desktop .itemsContainer .card .cardBox-bottompadded {
  margin-bottom: 1.8em !important;
}
.itemSelectionPanel {
  border: unset;
}
/* Allow scaled cards/text to extend outside their containers */
#listChildrenCollapsible .card,
#listChildrenCollapsible .cardBox,
#listChildrenCollapsible .cardText {
  overflow: visible !important;
}
/* =========================================================
   RIBBON / DETAIL VISIBILITY
========================================================= */
.detailRibbon {
  background-color: rgba(45, 45, 45, 0.9) !important;
}
.detailRibbon *,
.detailPagePrimaryContainer,
.detailPagePrimaryContainer *,
.detailPageWrapperContainer *,
.nameContainer,
.nameContainer *,
.itemMiscInfo,
.itemMiscInfo *,
.mediaInfoItem,
.mainDetailButtons,
.mainDetailButtons *,
.detailButton,
.detailButton * {
  opacity: 1 !important;
  filter: none !important;
}
.layout-desktop .itemName,
.layout-desktop .nameContainer,
.layout-desktop .itemMiscInfo,
.mediaInfoItem {
  color: #fff !important;
  margin-bottom: 0 !important;
}
.mainDetailButtons {
  padding-right: 4.5em !important;
}
.mainDetailButtons .detailButton,
.mainDetailButtons .material-icons,
.mainDetailButtons .material-symbols-outlined,
.mainDetailButtons i,
.mainDetailButtons svg {
  color: #fff !important;
  fill: #000 !important;
}
.nameContainer .itemMiscInfo .mainDetailButtons::before,
.mainDetailButtons .detailButton-primary::before {
  color: #00a4dc !important;
}
/* =========================================================
   BACKDROP
========================================================= */
.layout-desktop .backdropContainer {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 0 !important;
}
.layout-desktop .backdropImage.displayingBackdropImage {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: transparent !important;
}
.layout-desktop .backdropImage.displayingBackdropImage::after {
  content: none !important;
}
/* =========================================================
   SCROLLING GRADIENT
========================================================= */
.layout-desktop .detailPageWrapperContainer {
  position: relative !important;
  background: linear-gradient(
    to bottom,
    rgba(12, 12, 12, 0.25) 0%,
    rgba(12, 12, 12, 0.35) 8vh,
    rgba(12, 12, 12, 0.50) 15vh,
    rgba(12, 12, 12, 0.72) 25vh,
    rgba(12, 12, 12, 0.85) 40vh,
    rgba(12, 12, 12, 0.95) 55vh,
    #121212 75vh,
    #121212 100%
  ) !important;
}
.layout-desktop .detailPageWrapperContainer::before {
  display: none !important;
}
/* =========================================================
   MAIN CONTENT
========================================================= */
.layout-desktop .tagline {
  order: 1 !important;
  font-size: 1.5em !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
.detailSection {
  display: flex;
  flex-direction: column;
  color: #fff !important;
  margin-top: 20px;
 

}
.detailSectionContent {
  display: contents;
}
.detailSectionContent > * {
  order: 10;
}
/* Birth / death information */
#itemBirthday,
#itemDeathDate,
#itemBirthLocation {
  order: 2 !important;
  margin-bottom: 2px;
}
/* Overview */
.overview,
.overview-controls {
  order: 3 !important;
  margin-top: 0px;
  margin-bottom: 0;
  font-size: 1.18rem;
}
/* Item details */
.itemDetailsGroup {
  order: 5 !important;
  margin-bottom: 3em;
}
/* Tags */
.itemTags {
  order: 6 !important;
  margin-top: 0;
  font-weight: normal !important;
  font-size: 0.7rem !important;
  color: #fff !important;
}
/* Seasons / Next Up */
#listChildrenCollapsible {
  order: 7 !important;
}
.nextUpSection {
  order: 8 !important;
  margin-top: 0;
}
/* Hidden detail sections */
.itemGenres,
.trackSelections,
.itemExternalLinks,
#scenesCollapsible,
#collectionsCollapsible {
  display: none !important;
}
/* =========================================================
   SECONDARY SECTIONS
========================================================= */
.detailPageSecondaryContainer {
  display: flex !important;
  flex-direction: column !important;
}
.detailPageSecondaryContainer > * {
  order: 50;
}
#specialsCollapsible {
  order: 10 !important;
  margin-top: 1.5em;
  margin-bottom: 0;
}
#musicVideosCollapsible,
#additionalPartsCollapsible {
  order: 15 !important;
  margin-bottom: 0;
}
#castCollapsible {
  order: 20 !important;
  margin-bottom: 0;
}
#guestCastCollapsible {
  order: 21 !important;
  margin-bottom: 0;
}
#similarCollapsible {
  order: 30 !important;
  margin-bottom: 0;
}
.verticalSection {
  margin-bottom: 0;
}
/* =========================================================
   COLLECTIONS PAGE
========================================================= */
/* Collection content fills the available page width */
.itemDetailPage:has(.collectionItems) .collectionItems {
  width: 100% !important;
  max-width: none !important;
  margin: 0.0em 0 0 !important;
  padding: 0 0% !important;
  clear: both !important;
  float: none !important;
  position: relative !important;
  left: 0 !important;
  order: 20 !important;          /* ← force it below the overview */
}

/* Collection grid */
.itemDetailPage:has(.collectionItems) .collectionItemsContainer {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
  width: 100% !important;
  max-width: none !important;
  gap: 12px !important;
}

/* Keep overview early in the flex order */
.itemDetailPage:has(.collectionItems) .overview,
.itemDetailPage:has(.collectionItems) .overview.detail-clamp-text,
.itemDetailPage:has(.collectionItems) .overview-controls {
  order: 3 !important;
  margin-top: 0.4em !important;
  margin-bottom: 0.8em !important;
}
/* HIDE Genres */
.itemDetailsGroup {
  display: none !important;


}
/* -------------------------------------------------- */

/* =========================================================
   COLLECTION CARDS — LARGER, KEEP FULL IMAGE
========================================================= */
.itemDetailPage:has(.collectionItems) .collectionItemsContainer .portraitCard {
  width: 2000px !important;
  flex: 0 0 190px !important;
}
.itemDetailPage:has(.collectionItems) .collectionItemsContainer .portraitCard .cardBox {
  width: 190px !important;
}
.itemDetailPage:has(.collectionItems) .collectionItemsContainer .portraitCard .cardScalable {
  width: 190px !important;
}
.itemDetailPage:has(.collectionItems) .collectionItemsContainer .portraitCard .cardPadder-portrait {
  width: 190px !important;
  padding-bottom: 142.72% !important;
}
.itemDetailPage:has(.collectionItems) .collectionItemsContainer .portraitCard .cardImageContainer {
  width: 190px !important;
}
/* =========================================================
   CAST & CREW
========================================================= */
.layout-desktop #castCollapsible,
.layout-desktop .verticalSection:has(.peopleHeader),
.layout-desktop .peopleHeader {
  margin-top: 2em !important;
  padding-top: 2em !important;
  padding-bottom: 2em !important;
}
/* =========================================================
   JELLYFIN MEDIA BAR
========================================================= */
#jf-media-bar {
  position: relative;
  height: 700px;
  overflow: hidden;
  background: #000;
  padding: 0 !important;
}
/* =========================================================
   MAIN DETAIL BUTTON HOVER
========================================================= */
.mainDetailButtons .detailButton:hover .material-icons,
.mainDetailButtons .detailButton:hover .detailButton-icon,
.mainDetailButtons .detailButton:focus .material-icons,
.mainDetailButtons .detailButton:focus .detailButton-icon {
  color: #00a4dc !important;
}
