import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function ImageToBase64() {
  const [, setLocation] = useLocation();
  const [base64String, setBase64String] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [imageDimensions, setImageDimensions] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(2) + " KB");

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64String(result);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64String);
  };

  const downloadBase64 = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(base64String));
    element.setAttribute("download", `${fileName.split(".")[0]}-base64.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>${fileName} - Base64</title>
</head>
<body>
    <h1>${fileName}</h1>
    <p><strong>Dimensions:</strong> ${imageDimensions}</p>
    <p><strong>File Size:</strong> ${fileSize}</p>
    <h2>Base64 String:</h2>
    <textarea style="width: 100%; height: 200px; font-family: monospace; font-size: 12px;">${base64String}</textarea>
    <h2>Image Preview:</h2>
    <img src="${base64String}" style="max-width: 100%; border: 1px solid #ccc; margin-top: 20px;" />
</body>
</html>`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html));
    element.setAttribute("download", `${fileName.split(".")[0]}.html`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setBase64String("");
    setImagePreview("");
    setFileName("");
    setFileSize("");
    setImageDimensions("");
  };

  const loadSample = async () => {
    try {
      // Create a simple sample image using canvas
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 200, 200);
        gradient.addColorStop(0, "#00D4FF");
        gradient.addColorStop(1, "#0099FF");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);

        // Draw text
        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Sample", 100, 90);
        ctx.fillText("Image", 100, 120);

        const dataUrl = canvas.toDataURL("image/png");
        setBase64String(dataUrl);
        setImagePreview(dataUrl);
        setFileName("sample-image.png");
        setFileSize("~2 KB");
        setImageDimensions("200 × 200 px");
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Image to Base64</h1>
          <p className="text-slate-600">Convert images to Base64 encoded strings</p>
        </div>

        {/* Upload Section */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image file to convert to Base64</CardDescription>
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

        {/* Preview and Info */}
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

              {/* Image Info */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Image Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600">File Name</p>
                    <p className="font-semibold text-slate-900">{fileName}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600">File Size</p>
                    <p className="font-semibold text-slate-900">{fileSize}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-slate-600">Dimensions</p>
                    <p className="font-semibold text-slate-900">{imageDimensions}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-slate-600">Base64 Length</p>
                    <p className="font-semibold text-slate-900">{base64String.length.toLocaleString()} characters</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Base64 Output */}
            <Card className="border-slate-200 shadow-sm mb-6">
              <CardHeader>
                <CardTitle>Base64 String</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={base64String}
                  readOnly
                  className="w-full h-40 p-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:outline-none overflow-auto"
                />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Base64
                  </Button>
                  <Button onClick={downloadBase64} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Text
                  </Button>
                  <Button onClick={downloadAsHTML} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download HTML
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Info Section */}
        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Base64 Encoding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              <strong>Base64</strong> is a method of encoding binary data into ASCII text format. It's commonly used to embed images in HTML/CSS or transmit binary data over text-only channels.
            </p>
            <p>
              <strong>Use Cases:</strong> Embedding images in emails, data URIs in HTML, API payloads, and data storage.
            </p>
            <p>
              <strong>Note:</strong> Base64 encoding increases file size by approximately 33%. For web use, consider using actual image files for better performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
