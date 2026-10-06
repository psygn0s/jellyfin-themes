# 🌑 Psygn0sis Shadows Jellyfin Theme

The theme combines custom CSS with a JavaScript layer that adds soft drop shadows to the detail-page poster and a blurred shadow under the ribbon.

A custom **desktop-focused Jellyfin theme** designed to give the detail page a cleaner, darker, more cinematic look while keeping the familiar Jellyfin interface.

---

# ✨ Features

## 🖼️ Poster Drop Shadow
Soft, adjustable box-shadow applied to the main item poster on the detail page.

## 🌑 Ribbon Shadow
Blurred shadow under the detail ribbon for depth and separation from the backdrop.

## 🌄 Cinematic Backdrop
Full-viewport backdrop that stays fixed while content scrolls over it.

## 🌑 Scrolling Dark Gradient
Smooth dark gradient over the backdrop that intensifies as you scroll.

## 🖼️ Custom Detail Logo
Positioned logo treatment on the detail page.

## 🎞️ Card Hover Effects
Subtle scale-up on hover for library cards.

## 📋 Custom Metadata Layout
Reordered and cleaned-up primary metadata (tagline, overview, details, etc.).

## 🧹 Cleaner Detail Page
Hides less-useful sections (genres, external links, scenes, collections, Next Up) and tightens spacing.

## 👥 Improved Cast & Crew
Special Features appear above Cast & Crew, with better section spacing.

---

# 🚀 Installation

# 🔌 Step 1 — Install JavaScript Injector Plugin

In Jellyfin, open:

**Dashboard → Plugins → Catalog**

Click the **⚙️ Repository** button.

Select **Add Repository**.

Name: `JavaScript Injector`

### Jellyfin 10.11

```text
https://raw.githubusercontent.com/n00bcodr/jellyfin-plugins/main/10.11/manifest.json
```

### Jellyfin 12+

```text
https://raw.githubusercontent.com/n00bcodr/jellyfin-plugins/main/12/manifest.json
```

Click **Save**.

Return to the Plugin Catalog and search for:

**JavaScript Injector**

Click **Install** and restart Jellyfin when prompted.

For more information, visit the official **[Jellyfin JavaScript Injector GitHub repository](https://github.com/n00bcodr/Jellyfin-JavaScript-Injector)**.

---

# 🧩 Step 2 — Install theme

🎨 Install the Shadows JavaScript

After restarting Jellyfin, open:

**Dashboard → Plugins → JS Injector**

Click:

**Add Script**

Give the script a name such as:

`Psygn0sis Shadows`

Paste the following into the field:

```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/psygn0s/jellyfin-themes@latest/jellyfin-shadows/shadow-only.js';
script.async = true;
document.head.appendChild(script);
```

Make sure the script is **Enabled**.

Click **Save**.

---

# 🎨 Step 3 — Install the CSS Theme

Copy this into Jellyfin → Dashboard → Branding → Custom CSS:

```css
@import url("https://cdn.jsdelivr.net/gh/psygn0s/jellyfin-themes@latest/jellyfin-shadows/shadow-only.css");
```

Paste it into Jellyfin's **Custom CSS** field.

Click **Save**.

---

# 🔄 Step 4 — Refresh Jellyfin

Perform a hard refresh after installing the CSS and JavaScript.

### Windows / Linux

`Ctrl + F5`

### macOS

`Cmd + Shift + R`

The theme should now be active.

---

# 🛠️ Customization

## 🌑 Backdrop Darkness

The scrolling gradient can be adjusted in `shadow-only.css`:

```css
background: linear-gradient(
  to bottom,
  rgba(12, 12, 12, 0.10) 0%,
  rgba(12, 12, 12, 0.25) 8vh,
  rgba(12, 12, 12, 0.45) 15vh,
  rgba(12, 12, 12, 0.82) 25vh,
  rgba(12, 12, 12, 0.90) 40vh,
  rgba(12, 12, 12, 0.95) 55vh,
  #121212 75vh,
  #121212 100%
);
```

Increase the alpha values to make the gradient darker.

---

## 🎞️ Card Hover Size

The card hover effect is controlled by:

```css
transform: scale(1.1);
```

For a more subtle effect:

```css
transform: scale(1.05);
```

---

## 🖼️ Poster Shadow

Poster shadow values are controlled at the top of `shadow-only.js`:

```javascript
const POSTER_SHADOW_X = 2;
const POSTER_SHADOW_Y = 2;
const POSTER_SHADOW_BLUR = 35;
const POSTER_SHADOW_SPREAD = 4.5;
const POSTER_SHADOW_OPACITY = 0.45;
```

Examples:

- Softer / lighter: lower `POSTER_SHADOW_BLUR` and `POSTER_SHADOW_OPACITY`
- Stronger / deeper: raise `POSTER_SHADOW_BLUR`, `POSTER_SHADOW_SPREAD`, and `POSTER_SHADOW_OPACITY`

---

## 🌑 Ribbon Shadow

Ribbon shadow values are also at the top of `shadow-only.js`:

```javascript
const RIBBON_SHADOW_BOTTOM = -10;
const RIBBON_SHADOW_HEIGHT = 20;
const RIBBON_SHADOW_BLUR = 25;
const RIBBON_SHADOW_OPACITY = 50;
```

- `RIBBON_SHADOW_OPACITY` is used as the alpha component of `rgba(0, 0, 0, …)` (0–1 range in practice; higher = darker).
- Increase `RIBBON_SHADOW_BLUR` / `RIBBON_SHADOW_HEIGHT` for a softer, larger shadow.
- Adjust `RIBBON_SHADOW_BOTTOM` to move the shadow up or down relative to the ribbon.

---



# ⭐ Credits

Created for the Jellyfin community by **Psygn0sis**.

Built using:

* [Jellyfin](https://jellyfin.org/)
* [Jellyfin JavaScript Injector](https://github.com/n00bcodr/Jellyfin-JavaScript-Injector)

---
