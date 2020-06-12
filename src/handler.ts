import { imageSync, image_type } from "qr-image";

export async function handleRequest(req: Request): Promise<Response> {

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }


  try {
    const url: URL = new URL(req.url);
    if (req.method !== "GET")
      return new Response("No HTTP GET method used to call this function", { status: 405, statusText: "Method not allowed" });
    const code = url.searchParams.get("code");
    const type: image_type = url.searchParams.has("type") ? url.searchParams.get("type") as any : "svg";
    if (!code)
      return new Response("No query parameter `code` for QR-code generation provided", { status: 400 });
    let size = url.searchParams.has("size") ? parseInt(url.searchParams.get("size")) : undefined;
    if (code.length > 2048)
      return new Response("Provided string exeeds max length of 2024 characters", { status: 400 });

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
        if (size === undefined)
          size = 10
    }

    const qrCode = imageSync(code, { type, margin: 2, size });
    return new Response(qrCode, { headers: { "Content-type": contentType, 'Access-Control-Allow-Origin': '*' }, status: 200 });
  } catch (e) {
    return new Response(e, { status: 500 });
  }
}
