import { NextApiHandler } from "next";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

const extractSvgSize = (svgCode: string) => {
  const widthMatch = svgCode.match(/width="([^"]*)"/);
  const heightMatch = svgCode.match(/height="([^"]*)"/);

  const width = widthMatch ? widthMatch[1] : null;
  const height = heightMatch ? heightMatch[1] : null;

  return { width, height };
};

const getTimestamp = (): number => {
  return Date.now();
};

function getFileNameFromPath(filePath= " ") {
  const parts = filePath.split("\\");
  const fileName = parts[parts.length - 1];
  const cleanFileName = fileName.split("?")[0];
  return cleanFileName;
}

const mergePDFs = async (pdfFilePaths: string[]) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const pdfFilePath of pdfFilePaths) {
      const pdfBytes = fs.readFileSync(pdfFilePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const pdfBytes = await pdfDoc.save();

    const out = `Instacarol_Export_${getTimestamp()}.pdf`;

    const outputPath = path.join(process.cwd(), "public", "pdf", out);
    console.log(out);
    fs.writeFileSync(outputPath, pdfBytes);
    pdfFilePaths.forEach((pdfFilePath) => {
      fs.unlink(pdfFilePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    return outputPath;
  } catch (error) {
    throw new Error("Error merging PDFs.");
  }
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const { svgCodes } = req.body; // array data

    // Initialize mergedPDFPath with an empty string
    let mergedPDFPath = "";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pdfFiles: string[] = [];
    const outputFolder = "pdf"; // Output folder name inside the "public" directory

    for (let i = 0; i < svgCodes.length; i++) {
      const svgCode = svgCodes[i];

      if (svgCode.trim() !== "") {
        let paraMeter = svgCode.toString();
        let size = extractSvgSize(paraMeter);

        const pdfFilePath = path.join(
          process.cwd(),
          "public",
          outputFolder,
          `Instacarol_Export_${getTimestamp()}.pdf`
        );

        // Add the *{margin:0,padding:0} CSS rule to the SVG content
        const svgWithCss = `<style>*{margin:0;padding:0}</style><div>${svgCode}</div>`;

        await page.setContent(svgWithCss, { waitUntil: "networkidle0" });

        await page.pdf({
          path: pdfFilePath,
          width: `${size.width}px`,
          height: `${size.height}px`,
          printBackground: true,
        });

        pdfFiles.push(pdfFilePath);

        await page.setContent("");
      }
    }

    await browser.close();

    if (pdfFiles.length > 1) {
    mergedPDFPath = await mergePDFs(pdfFiles);

      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="Instacarol Export.pdf"'
      // );
      // res.setHeader("Content-Type", "application/pdf");
      // res.status(200).end(pdfContent);
    } else {
      // If there are less than or equal to 2 pages, use the first PDF directly
      mergedPDFPath = pdfFiles[0];
     

      // Stream the PDF file to the user as an attachment
      // const pdfContent = fs.readFileSync(mergedPDFPath);
      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="Instacarol Export.pdf"'
      // );
      // res.setHeader("Content-Type", "application/pdf");
      // res.status(200).end(pdfContent);
    }


    res.status(200).json({

      file: "/pdf/" +  getFileNameFromPath(mergedPDFPath)
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while converting the SVGs to PDF." });
  }
};

export default handler;
