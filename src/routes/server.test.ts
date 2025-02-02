import { describe, it, expect } from "vitest";

describe("QR Code Generator", () => {
  it("should return a QR code as SVG", async () => {
    const response = await fetch("http://localhost:5173/?code=hello&type=svg");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(await response.text()).toEqual(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><path d="M2 2h7v7h-7zM11 2h2v1h-1v2h-1v-1h-1v-1h1zM16 2h7v7h-7zM3 3v5h5v-5zM17 3v5h5v-5zM4 4h3v3h-3zM13 4h2v1h-1v1h-2v-1h1zM18 4h3v3h-3zM10 6h2v1h-2zM14 6h1v4h-1v1h-1v-1h-1v-2h1v1h1zM10 8h1v1h-1zM2 10h1v1h-1zM4 10h1v2h-1zM6 10h1v1h1v1h-2zM8 10h1v1h-1zM11 10h1v1h-1zM18 10h1v1h-1zM21 10h1v1h1v2h-1v1h-1v-1h-3v-1h3zM12 11h1v2h-3v-1h2zM16 11h1v1h-1zM3 12h1v2h1v1h-2v-1h-1v-1h1zM5 12h1v1h-1zM8 12h1v1h-1zM14 12h1v1h-1zM6 13h1v2h-1zM16 13h1v2h-1zM8 14h2v1h-2zM12 14h1v1h1v2h1v-2h1v1h1v-1h1v2h1v1h-1v2h-2v-1h-1v-1h-1v1h-2v-3h-2v-1h2zM14 14h1v1h-1zM18 14h1v1h-1zM20 15h3v2h-3zM2 16h7v7h-7zM3 17v5h5v-5zM16 17v1h1v-1zM4 18h3v3h-3zM10 18h1v1h-1zM21 18h2v1h-1v1h-1v1h-1v-2h1zM11 19h1v1h1v1h-1v1h1v1h-3v-1h1v-1h-1v-1h1zM14 20h1v1h-1zM18 20h1v2h-1zM22 20h1v1h-1zM16 21h1v1h1v1h-2zM21 21h1v1h1v1h-2zM14 22h1v1h-1z"/></svg>`
    );
  });
  it("should return a QR code as PNG", async () => {
    const response = await fetch("http://localhost:5173/?code=hello&type=png");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(await response.text()).toContain("PNG");
  });
});
