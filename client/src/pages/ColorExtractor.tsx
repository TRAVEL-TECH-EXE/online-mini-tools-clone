import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ColorData {
  hex: string;
  rgb: string;
  hsl: string;
  count: number;
  percentage: number;
}

export default function ColorExtractor() {
  const [, setLocation] = useLocation();
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [colors, setColors] = useState<ColorData[]>([]);
  const [totalPixels, setTotalPixels] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      extractColors(result);
    };
    reader.readAsDataURL(file);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const extractColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const colorMap: { [key: string]: number } = {};

        // Sample every nth pixel to improve performance for large images
        const sampleRate = canvas.width * canvas.height > 1000000 ? 4 : 1;

        for (let i = 0; i < data.length; i += 4 * sampleRate) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          const hex = rgbToHex(r, g, b);
          colorMap[hex] = (colorMap[hex] || 0) + 1;
        }

        const totalPixels = Object.values(colorMap).reduce((a, b) => a + b, 0);
        setTotalPixels(totalPixels);

        const colorArray: ColorData[] = Object.entries(colorMap)
          .map(([hex, count]) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return {
              hex,
              rgb: `rgb(${r}, ${g}, ${b})`,
              hsl: rgbToHsl(r, g, b),
              count,
              percentage: (count / totalPixels) * 100,
            };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        setColors(colorArray);
      }
    };
    img.src = imageUrl;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadColorPalette = () => {
    const css = colors
      .map((color, idx) => `.color-${idx + 1} { background-color: ${color.hex}; }`)
      .join("\n");

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Color Palette - ${fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .palette { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
        .color-box { padding: 20px; border-radius: 8px; text-align: center; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
        .color-info { font-size: 12px; margin-top: 5px; }
        ${css}
    </style>
</head>
<body>
    <h1>Color Palette from ${fileName}</h1>
    <div class="palette">
        ${colors
          .map(
            (color, idx) => `
        <div class="color-box color-${idx + 1}">
            <div class="color-info">
                <strong>${color.hex}</strong><br>
                ${color.percentage.toFixed(1)}%
            </div>
        </div>
        `
          )
          .join("")}
    </div>
</body>
</html>`;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html));
    element.setAttribute("download", `${fileName.split(".")[0]}-palette.html`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setImagePreview("");
    setFileName("");
    setColors([]);
    setTotalPixels(0);
  };

  const loadSample = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Create a colorful gradient
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
        const squareSize = 60;

        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            ctx.fillStyle = colors[(i + j) % colors.length];
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
          }
        }

        const dataUrl = canvas.toDataURL("image/png");
        setImagePreview(dataUrl);
        setFileName("sample-image.png");
        extractColors(dataUrl);
      }
    } catch (error) {
      console.error("Error creating sample image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Color Extractor</h1>
          <p className="text-slate-600">Extract and analyze colors from images</p>
        </div>

        {/* Upload Section */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image to extract colors from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-cyan-400 transition">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PNG, JPG, GIF, WebP, etc.</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={loadSample} variant="outline" className="flex-1">
                Load Sample
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview and Colors */}
        {imagePreview && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Image Preview */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-80 rounded"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600">File Name</p>
                    <p className="font-semibold text-slate-900">{fileName}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">Colors Found</p>
                    <p className="font-semibold text-slate-900">{colors.length}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-slate-600">Total Pixels Analyzed</p>
                    <p className="font-semibold text-slate-900">{totalPixels.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Color Palette */}
            {colors.length > 0 && (
              <Card className="border-slate-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle>Top 20 Colors</CardTitle>
                  <Button
                    onClick={downloadColorPalette}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Palette
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-slate-300 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{color.hex}</div>
                          <div className="text-sm text-slate-600">{color.rgb}</div>
                          <div className="text-xs text-slate-500">{color.hsl}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{color.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-slate-500">{color.count} pixels</div>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(color.hex)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Info Section */}
        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Color Extraction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              <strong>Color Extraction</strong> analyzes an image and identifies the most dominant colors used in it.
            </p>
            <p>
              <strong>Supported Formats:</strong> HEX (#RRGGBB), RGB (Red, Green, Blue), HSL (Hue, Saturation, Lightness)
            </p>
            <p>
              <strong>Use Cases:</strong> Design inspiration, creating color palettes, analyzing brand colors, and color scheme generation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
