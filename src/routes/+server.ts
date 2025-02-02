import { imageSync, type image_type } from "qr-image";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const code = url.searchParams.get("code");
    const type: image_type = url.searchParams.has("type")
      ? (url.searchParams.get("type") as any)
      : "svg";
    if (!code)
      return new Response(
        "No query parameter `code` for QR-code generation provided",
        { status: 400 }
      );
    let size = url.searchParams.has("size")
      ? parseInt(url.searchParams.get("size") as any)
      : undefined;
    if (code.length > 2048)
      return new Response(
        "Provided string exeeds max length of 2024 characters",
        { status: 400 }
      );

    let contentType: string;
    switch (type) {
      case "eps":
        contentType = "application/postscript";
        break;
      case "pdf":
        contentType = "application/pdf";
        break;
      case "svg":
        contentType = "image/svg+xml";
        break;
      case "png":
      default:
        contentType = "image/png";
        if (size === undefined) size = 10;
    }

    const qrCode = imageSync(code, { type, margin: 2, size });
    return new Response(qrCode, {
      headers: {
        "Content-type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
};
