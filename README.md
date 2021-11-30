# Flying Santa

Fun little christmas gimmick Web Component, works anywhere, based on [Lit](https://lit.dev) and [TypeScript](https://www.typescriptlang.org/).

[See landing page](https://divriots.github.io/flying-santa/)

[See the full demos & code](https://webcomponents.dev/edit/MW0MuMtZp2VIRSFEzvQ0/stories/index.stories.js)

## Usage

```sh
npm i @divriots/flying-santa
```

```html
<script type="module">
import '@divriots/flying-santa';
</script>
<flying-santa></flying-santa>
```

Or if you want to extend the component

```js
import { FlyingSanta } from '@divriots/flying-santa';
```

Or from a CDN without needing NPM

```html
<script type="module" src="https://unpkg.com/@divriots/flying-santa/dist/index.js?module"></script>
<flying-santa></flying-santa>
```

## Features

- Configure the interval speed at which Santa changes direction with the `change-speed` attribute (default 5000, which is milliseconds)
- Configure speed amplifier to change how fast Santa travels with the `speed` attribute (default 1)
- Change the distance at which Santa starts throwing presents with the `presents-distance` attribute (default 100, which is in pixels)
- Change the interval at which Santa throws presents with the `presents-interval` (default 100)
- Configure the gravity strength pulling on the thrown presents with the `presents-drop-speed` (default 0.5)

## SPA accumulating Santas

Note that Santa can be put anywhere on the page, and then it will insert itself into `<html>` element and fly all over your page.
If you use SPA pattern and have the flying-santa on multiple pages, the number of Santas will accumulate.

Therefore, you probably want to clean up the Santas on route switching, there's a util for that:

```js
import { cleanup } from '@divriots/flying-santa';

// whenever you switch routes call this before the new page renders
// if you're using a different tag-name for your Santa element, pass it as an argument
cleanup();
```