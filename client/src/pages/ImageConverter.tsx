import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, RotateCcw, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ImageConverter() {
  const [, setLocation] = useLocation();
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [outputFormat, setOutputFormat] = useState<"png" | "jpg" | "webp" | "gif">("png");
  const [quality, setQuality] = useState(90);
  const [imageDimensions, setImageDimensions] = useState("");

  const formats = [
    { value: "png", label: "PNG", mimeType: "image/png" },
    { value: "jpg", label: "JPG", mimeType: "image/jpeg" },
    { value: "webp", label: "WebP", mimeType: "image/webp" },
    { value: "gif", label: "GIF", mimeType: "image/gif" },
  ];

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

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions(`${img.width} × ${img.height} px`);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const convertImage = () => {
    if (!imagePreview) {
      alert("Please upload an image first");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const mimeType = formats.find((f) => f.value === outputFormat)?.mimeType || "image/png";
        const qualityValue = outputFormat === "jpg" || outputFormat === "webp" ? quality / 100 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              const baseName = fileName.split(".")[0];
              link.download = `${baseName}.${outputFormat}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          },
          mimeType,
          qualityValue
        );
      }
    };
    img.src = imagePreview;
  };

  const reset = () => {
    setImagePreview("");
    setFileName("");
    setOutputFormat("png");
    setQuality(90);
    setImageDimensions("");
  };

  const loadSample = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, "#FF6B6B");
        gradient.addColorStop(0.5, "#4ECDC4");
        gradient.addColorStop(1, "#45B7D1");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 300);

        // Draw shapes
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(300, 200, 60, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Sample Image", 200, 150);

        const dataUrl = canvas.toDataURL("image/png");
        setImagePreview(dataUrl);
        setFileName("sample-image.png");
        setImageDimensions("400 × 300 px");
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Image Converter</h1>
          <p className="text-slate-600">Convert images between different formats (PNG, JPG, WebP, GIF)</p>
        </div>

        {/* Upload Section */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image file to convert</CardDescription>
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

        {/* Preview and Settings */}
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

              {/* Conversion Settings */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Conversion Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Output Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {formats.map((format) => (
                        <Button
                          key={format.value}
                          variant={outputFormat === format.value ? "default" : "outline"}
                          onClick={() => setOutputFormat(format.value as any)}
                          className={outputFormat === format.value ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                        >
                          {format.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {(outputFormat === "jpg" || outputFormat === "webp") && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Higher quality = larger file size
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600">Original File</p>
                    <p className="font-semibold text-slate-900">{fileName}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">Dimensions</p>
                    <p className="font-semibold text-slate-900">{imageDimensions}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Convert Button */}
            <Button
              onClick={convertImage}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-6 text-lg mb-6"
            >
              <Download className="w-5 h-5 mr-2" />
              Convert and Download
            </Button>
          </>
        )}

        {/* Info Section */}
        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Image Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <div>
              <strong>PNG:</strong> Lossless compression, supports transparency, larger file size. Best for graphics and images requiring transparency.
            </div>
            <div>
              <strong>JPG:</strong> Lossy compression, smaller file size, no transparency. Best for photographs and complex images.
            </div>
            <div>
              <strong>WebP:</strong> Modern format with better compression than JPG/PNG. Smaller file sizes, supports transparency and animation.
            </div>
            <div>
              <strong>GIF:</strong> Supports animation and transparency, limited color palette. Best for simple animations and graphics.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
