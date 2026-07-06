import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/**
 * Extract plain text from a PDF file.
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    pageTexts.push(strings.join(' '));
  }

  return pageTexts.join('\n\n');
}

/**
 * Extract plain text from a DOCX file.
 */
export async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Dispatch to the correct parser based on file extension.
 * Throws on unsupported types.
 */
export async function extractResumeText(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  if (name.endsWith('.docx')) {
    return extractTextFromDocx(file);
  }

  throw new Error(
    `Unsupported file type: "${name.split('.').pop()}". Please upload a PDF or DOCX file.`
  );
}
