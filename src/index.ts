// Bunny Edge Script entry point.
// Bunny Edge Scripting runs on a Deno-based runtime and exposes the
// BunnySDK for wiring up a fetch-style HTTP handler.
// Docs: https://docs.bunny.net/docs/edge-scripting-overview
//
// The QR generation logic lives in `./handler.ts` so it can be unit-tested
// under Node (vitest) without depending on the Bunny runtime.

// @ts-expect-error - Bunny resolves this URL specifier at deploy time.
import BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.12.2";
import { handleRequest } from "./handler.ts";

BunnySDK.net.http.serve(handleRequest);
