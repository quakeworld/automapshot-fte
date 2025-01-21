# automapshot-fte

> Automate screenshots of QuakeWorld maps (mapshots) using [FTE](https://fte.triptohell.info/)
> and [Playwright](https://playwright.dev/)

![Aerowalk](https://github.com/vikpe/qw-mapshots/blob/main/aerowalk.jpg?raw=true)

## Setup

```shell
pnpx playwright install --with-deps chromium
pnpm install
```

1. Rename `config.example.ts` to `config.ts`
2. Rename `config.maps.example.ts` to `config.maps.ts`
3. (optional) edit `config.ts`

## Configuration

### General config (`config.ts`)

```ts
export default {
    width: 1280,
    height: 720,
    jpegQuality: 90, // 1-100
    skipExisting: true, // skip if screenshot already exist in /dist
};
```

### Map config (`config.maps.ts`)

Camera position (first triplet) and angle (second triplet).

```ts
export default {
    "2bfree": "1380 1067 468 25 194 0",
    "dm3": "1835 -342 18 19 128 0",
    "outpost": "0 0 480 90 91 -59",
};
```

## Usage

### Screenshot all maps defined in `config.maps.ts`

```shell
pnpm exec playwright test
```

### Screenshot single map (exact match)

```shell
pnpm exec playwright test --grep "#dm2#"
```

### Screenshot multiple maps (wildcard match)

```shell
pnpm exec playwright test --grep "dm2"
```

## Tips

### Batch compression

Playwrights compression is sub-optimal. Use mogrify from the imagemagik package for better compression.

```sh
mkdir -p dist/compressed
mogrify -format jpg -quality 80 -path dist/compressed dist/*.jpg
```

## Related projects

* [QuakeWorld Mapshots](https://github.com/vikpe/qw-mapshots)
* [FTEQW](https://github.com/fte-team/fteqw)
* [Playwright](https://github.com/microsoft/playwright)
