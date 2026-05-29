import { toPng } from "html-to-image";

export async function generateReport(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    backgroundColor: "#F8FAFC",
    cacheBust: true,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
