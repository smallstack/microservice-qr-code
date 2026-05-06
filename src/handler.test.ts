import { describe, expect, it } from "vitest";
import { handleRequest } from "./handler";

const request = (query: string) =>
  new Request(`https://qr.example.com/?${query}`);

describe("QR Code handler", () => {
  it("returns a QR code as SVG by default", async () => {
    const response = await handleRequest(request("code=hello"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(await response.text()).toBe(
      "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25 25\"><path d=\"M2 2h7v7h-7zM11 2h2v1h-1v2h-1v-1h-1v-1h1zM16 2h7v7h-7zM3 3v5h5v-5zM17 3v5h5v-5zM4 4h3v3h-3zM13 4h2v1h-1v1h-2v-1h1zM18 4h3v3h-3zM10 6h2v1h-2zM14 6h1v4h-1v1h-1v-1h-1v-2h1v1h1zM10 8h1v1h-1zM2 10h1v1h-1zM4 10h1v2h-1zM6 10h1v1h1v1h-2zM8 10h1v1h-1zM11 10h1v1h-1zM18 10h1v1h-1zM21 10h1v1h1v2h-1v1h-1v-1h-3v-1h3zM12 11h1v2h-3v-1h2zM16 11h1v1h-1zM3 12h1v2h1v1h-2v-1h-1v-1h1zM5 12h1v1h-1zM8 12h1v1h-1zM14 12h1v1h-1zM6 13h1v2h-1zM16 13h1v2h-1zM8 14h2v1h-2zM12 14h1v1h1v2h1v-2h1v1h1v-1h1v2h1v1h-1v2h-2v-1h-1v-1h-1v1h-2v-3h-2v-1h2zM14 14h1v1h-1zM18 14h1v1h-1zM20 15h3v2h-3zM2 16h7v7h-7zM3 17v5h5v-5zM16 17v1h1v-1zM4 18h3v3h-3zM10 18h1v1h-1zM21 18h2v1h-1v1h-1v1h-1v-2h1zM11 19h1v1h1v1h-1v1h1v1h-3v-1h1v-1h-1v-1h1zM14 20h1v1h-1zM18 20h1v2h-1zM22 20h1v1h-1zM16 21h1v1h1v1h-2zM21 21h1v1h1v1h-2zM14 22h1v1h-1z\"/></svg>",
    );
  });

  it("returns a QR code as PNG", async () => {
    const response = await handleRequest(request("code=hello&type=png"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    const buffer = new Uint8Array(await response.arrayBuffer());
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    expect(Array.from(buffer.slice(0, 8))).toEqual([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
  });

  it("returns 400 when `code` is missing", async () => {
    const response = await handleRequest(request(""));
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("No query parameter `code`");
  });

  it("returns 400 when `code` exceeds the max length", async () => {
    const tooLong = "a".repeat(2049);
    const response = await handleRequest(
      request(`code=${encodeURIComponent(tooLong)}`),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("exceeds max length");
  });

  it("returns 400 for an unsupported type", async () => {
    const response = await handleRequest(request("code=hi&type=jpg"));
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Unsupported type");
  });

  it("returns 400 when `size` is not a positive integer", async () => {
    const response = await handleRequest(request("code=hi&size=-3"));
    expect(response.status).toBe(400);
  });
});
