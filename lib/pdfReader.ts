import { extractText } from "unpdf";

export async function extractTextFromPDF(buffer: Buffer) {
  // Convert Buffer to Uint8Array
  const uint8Array = new Uint8Array(buffer);
  const result = await extractText(uint8Array);
  return result.text;
}
