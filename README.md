# QR Code Microservice

A small QR code microservice that runs as a [Bunny CDN Edge Script](https://docs.bunny.net/docs/edge-scripting-overview).
QR codes are generated with the [`qr-image`](https://www.npmjs.com/package/qr-image) library.

## Endpoint

```
GET /?code=<text>[&type=svg|png|pdf|eps][&size=<positive int>]
```

| Query param | Required | Default | Notes                                                |
| ----------- | -------- | ------- | ---------------------------------------------------- |
| `code`      | yes      | -       | The text to encode. Max 2048 characters.             |
| `type`      | no       | `svg`   | Output format. One of `svg`, `png`, `pdf`, `eps`.    |
| `size`      | no       | `10` for `png`, library default otherwise | Module size for raster output. Positive integer. |

The response includes `Access-Control-Allow-Origin: *` so it can be embedded
cross-origin.

## Project layout

```
src/
  handler.ts       Pure Web-API handler: (Request) => Promise<Response>
  handler.test.ts  Vitest unit tests (run under Node)
  index.ts         Bunny Edge Script entry point that wires the handler
                   into BunnySDK.net.http.serve()
deno.json          Deno config + import map for the Bunny runtime
```

The handler is deliberately separated from the entry point so it can be
unit-tested under Node/Vitest without pulling in the Bunny SDK or the Deno
runtime.

## Local development

The Bunny Edge Scripting runtime is Deno-based, so you can run the script
locally with [Deno](https://deno.land/):

```sh
deno task dev
# or
npm run dev
```

## Tests

```sh
npm test
```

## Deploy to Bunny CDN

1. Install the [Bunny CLI](https://docs.bunny.net/docs/edge-scripting-cli) and
   authenticate it.
2. Create an Edge Script in the Bunny dashboard (or via CLI) and link it to
   this repo.
3. Push or run `bunny deploy` (see `package.json#scripts.deploy`).

The entry point Bunny will invoke is `src/index.ts`.
