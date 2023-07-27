import axios from "axios";

export default function Home() {
  const svgCodes = [
    `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="800" height="800" viewBox="0 0 800 800" xml:space="preserve">
    <desc>Created with Fabric.js 5.3.0</desc>
    <defs>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="#1B2528"></rect>
    <g transform="matrix(1 0 0 1 400.5 158.74)" style=""  >
        <text xml:space="preserve" font-family="Times New Roman" font-size="48" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-360" y="-12.04" >Have you ever felt overwhelmed and</tspan><tspan x="-360" y="42.2" style="white-space: pre; ">lost? </tspan></text>
    </g>
    </svg>`,
    `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="800" height="800" viewBox="0 0 800 800" xml:space="preserve">
    <desc>Created with Fabric.js 5.3.0</desc>
    <defs>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="#1B2528"></rect>
    <g transform="matrix(1 0 0 1 400.5 158.74)" style=""  >
        <text xml:space="preserve" font-family="Times New Roman" font-size="48" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-360" y="-12.04" >Have you ever felt overwhelmed and</tspan><tspan x="-360" y="42.2" style="white-space: pre; ">lost? </tspan></text>
    </g>
    </svg>`
  ];
  const handleConvertToPDF = async () => {
    try {
      const response = await axios.post(
        "/api/generate-svgtopdf",
        { svgCodes },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.file) {
        throw new Error("Faied to convert SVGs to PDF.");
      }

      const { file } = response.data;

      // Create a temporary anchor element and trigger the download
      const a = document.createElement("a");
      a.download = "Instacarol Export.pdf";

      console.log(file);
      a.href = file;
      a.click();
    } catch (error) {
      console.error("Error during file download:", error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  return (
    <div>
      <button type="button" onClick={handleConvertToPDF}>
        Download
      </button>
    </div>
  );
}
