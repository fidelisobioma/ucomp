import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import mammoth from "mammoth";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: "authjs.session-token",
    });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "ADMIN" && token.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const paperSize = searchParams.get("paperSize") ?? "A4";

    if (!fileId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Fetch file from Uploadthing
    const fileResponse = await fetch(file.url);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 },
      );
    }

    const paperStyles = getPaperStyles(paperSize);

    // Handle DOCX — convert to HTML
    if (file.type === "DOCX") {
      const arrayBuffer = await fileResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.convertToHtml({ buffer });
      const html = generatePrintHTML({
        content: result.value,
        paperStyles,
        type: "html",
        title: file.name,
      });
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle Images — with passport/ID card grid support
    if (file.type === "JPG" || file.type === "PNG") {
      const html = generatePrintHTML({
        content: file.url,
        paperStyles,
        type: "image",
        title: file.name,
        paperSize,
      });
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle PDF — embed directly
    if (file.type === "PDF") {
      const html = generatePrintHTML({
        content: file.url,
        paperStyles,
        type: "pdf",
        title: file.name,
      });
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Print error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

function getPaperStyles(paperSize: string): string {
  const sizes: Record<string, string> = {
    A4: "@page { size: A4 portrait; margin: 10mm; }",
    A3: "@page { size: A3 portrait; margin: 10mm; }",
    LETTER: "@page { size: letter portrait; margin: 10mm; }",
    LEGAL: "@page { size: legal portrait; margin: 10mm; }",
    PASSPORT: "@page { size: 152mm 102mm landscape; margin: 2mm; }",
    ID_CARD: "@page { size: 85.6mm 54mm portrait; margin: 0; }",
  };
  return sizes[paperSize] ?? sizes.A4;
}

interface PrintHTMLOptions {
  content: string;
  paperStyles: string;
  type: "html" | "image" | "pdf";
  title: string;
  paperSize?: string;
}

function generatePrintHTML({
  content,
  paperStyles,
  type,
  title,
  paperSize,
}: PrintHTMLOptions): string {
  // Passport photo grid — 4x2 = 8 photos on 4x6 landscape
  if (type === "image" && paperSize === "PASSPORT") {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${paperStyles}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 152mm; height: 102mm; }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 35mm);
      grid-template-rows: repeat(2, 45mm);
      gap: 1mm;
      padding: 2mm;
    }
    .photo {
      width: 35mm;
      height: 45mm;
      overflow: hidden;
    }
    .photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="grid">
    ${Array(8)
      .fill(
        `
      <div class="photo">
        <img src="${content}" />
      </div>
    `,
      )
      .join("")}
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
  }

  // ID Card — single print
  if (type === "image" && paperSize === "ID_CARD") {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${paperStyles}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 85.6mm; height: 54mm; overflow: hidden; }
    img {
      width: 85.6mm;
      height: 54mm;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <img src="${content}" />
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
  }

  // Regular image
  if (type === "image") {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${paperStyles}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <img src="${content}" />
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
  }

  // PDF
  if (type === "pdf") {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${paperStyles}
    * { margin: 0; padding: 0; }
    body { width: 100%; height: 100vh; }
    embed {
      width: 100%;
      height: 100vh;
      border: none;
    }
  </style>
</head>
<body>
  <embed src="${content}" type="application/pdf" />
  <script>
    window.onload = () => {
      setTimeout(() => { window.print(); }, 1000);
    }
  </script>
</body>
</html>`;
  }

  // DOCX converted to HTML
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${paperStyles}
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    h1 { font-size: 18pt; margin-bottom: 12pt; }
    h2 { font-size: 16pt; margin-bottom: 10pt; }
    h3 { font-size: 14pt; margin-bottom: 8pt; }
    p { margin-bottom: 8pt; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 8pt; }
    td, th { border: 1px solid #000; padding: 4pt; }
  </style>
</head>
<body>
  ${content}
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}
