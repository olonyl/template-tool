// Fetches real TTF bytes from Google Fonts for use with next/og ImageResponse
// (satori needs ttf/otf, not woff2, so we spoof an old UA that gets served ttf).
const OLD_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko";

export async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": OLD_UA } })).text();
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error(`Could not resolve font file for ${family} ${weight}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}
