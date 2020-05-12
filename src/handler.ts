import { imageSync } from "qr-image";

export async function handleRequest(req: Request): Promise<Response> {
  const url: URL = new URL(req.url);
  if (req.method !== "GET")
    throw new Error("No HTTP GET method used to call this function");
  const code = url.searchParams.get("code");
  if (!code)
    throw new Error("No query parameter `code` for QR-code generation provided");
  if (code.length > 2048)
    throw new Error("Provided string exeeds max length of 2024 characters");

  const qrCode = imageSync(code, { type: "png", margin: 2 });
  return new Response(qrCode, { headers: { "Content-type": "image/png" } });
}
