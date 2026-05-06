// Bunny Edge Script entry point.
// Bunny Edge Scripting runs on a Deno-based runtime, uploads this file as
// `mod.ts`, and disallows relative imports — so the handler logic is inlined
// here rather than split across modules.
// Docs: https://docs.bunny.net/docs/edge-scripting-overview

// @ts-expect-error - Bunny resolves this URL specifier at deploy time.
import BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.12.1";
import { imageSync, type image_type } from "qr-image";

const MAX_CODE_LENGTH = 2048;

const CONTENT_TYPES: Record<image_type, string> = {
  eps: "application/postscript",
  pdf: "application/pdf",
  svg: "image/svg+xml",
  png: "image/png",
};

const isImageType = (value: string): value is image_type =>
  value in CONTENT_TYPES;

const handleRequest = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return new Response(
        "No query parameter `code` for QR-code generation provided",
        { status: 400 },
      );
    }
    if (code.length > MAX_CODE_LENGTH) {
      return new Response(
        `Provided string exceeds max length of ${MAX_CODE_LENGTH} characters`,
        { status: 400 },
      );
    }

    const typeParam = url.searchParams.get("type") ?? "svg";
    if (!isImageType(typeParam)) {
      return new Response(
        `Unsupported type \`${typeParam}\`. Supported: ${Object.keys(CONTENT_TYPES).join(", ")}`,
        { status: 400 },
      );
    }
    const type: image_type = typeParam;

    const sizeParam = url.searchParams.get("size");
    let size = sizeParam !== null ? parseInt(sizeParam, 10) : undefined;
    if (size !== undefined && (Number.isNaN(size) || size <= 0)) {
      return new Response("Query parameter `size` must be a positive integer", {
        status: 400,
      });
    }
    if (type === "png" && size === undefined) size = 10;

    const qrCode = imageSync(code, { type, margin: 2, size });
    const body: BodyInit =
      typeof qrCode === "string"
        ? qrCode
        // Copy the Buffer's view into a fresh Uint8Array<ArrayBuffer> so the
        // type matches BodyInit on both Node and the Bunny edge runtime.
        : Uint8Array.from(qrCode);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPES[type],
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(message, { status: 500 });
  }
};

BunnySDK.net.http.serve(handleRequest);
