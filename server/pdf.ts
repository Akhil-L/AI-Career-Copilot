export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { default: pdfParse } = await import("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}