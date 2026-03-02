import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Upload, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface FormatOption {
  name: string;
  description: string;
  apply: (text: string) => string;
}

export default function TextFormatter() {
  const [, setLocation] = useLocation();
  const [text, setText] = useState("Hello World! This is a sample text for formatting.");
  const [selectedFormat, setSelectedFormat] = useState<string>("");

  const formatOptions: { [key: string]: FormatOption } = {
    uppercase: {
      name: "UPPERCASE",
      description: "Convert all text to uppercase",
      apply: (t) => t.toUpperCase(),
    },
    lowercase: {
      name: "lowercase",
      description: "Convert all text to lowercase",
      apply: (t) => t.toLowerCase(),
    },
    capitalize: {
      name: "Capitalize",
      description: "Capitalize first letter of each word",
      apply: (t) =>
        t.replace(/\b\w/g, (char) => char.toUpperCase()),
    },
    reverse: {
      name: "Reverse",
      description: "Reverse the entire text",
      apply: (t) => t.split("").reverse().join(""),
    },
    removeSpaces: {
      name: "Remove Spaces",
      description: "Remove all spaces from text",
      apply: (t) => t.replace(/\s+/g, ""),
    },
    removeNewlines: {
      name: "Remove Newlines",
      description: "Remove all line breaks",
      apply: (t) => t.replace(/\n+/g, " "),
    },
    trimWhitespace: {
      name: "Trim Whitespace",
      description: "Remove leading/trailing whitespace",
      apply: (t) => t.trim(),
    },
    removeExtraSpaces: {
      name: "Remove Extra Spaces",
      description: "Replace multiple spaces with single space",
      apply: (t) => t.replace(/\s+/g, " ").trim(),
    },
    addLineNumbers: {
      name: "Add Line Numbers",
      description: "Add line numbers to each line",
      apply: (t) =>
        t
          .split("\n")
          .map((line, idx) => `${idx + 1}. ${line}`)
          .join("\n"),
    },
    sortLines: {
      name: "Sort Lines",
      description: "Sort lines alphabetically",
      apply: (t) =>
        t
          .split("\n")
          .sort()
          .join("\n"),
    },
    removeDuplicateLines: {
      name: "Remove Duplicates",
      description: "Remove duplicate lines",
      apply: (t) => {
        const lines = t.split("\n");
        return Array.from(new Set(lines)).join("\n");
      },
    },
    reverseLines: {
      name: "Reverse Lines",
      description: "Reverse the order of lines",
      apply: (t) =>
        t
          .split("\n")
          .reverse()
          .join("\n"),
    },
    htmlEncode: {
      name: "HTML Encode",
      description: "Convert special characters to HTML entities",
      apply: (t) => {
        const div = document.createElement("div");
        div.textContent = t;
        return div.innerHTML;
      },
    },
    htmlDecode: {
      name: "HTML Decode",
      description: "Convert HTML entities to characters",
      apply: (t) => {
        const div = document.createElement("div");
        div.innerHTML = t;
        return div.textContent || div.innerText || "";
      },
    },
    urlEncode: {
      name: "URL Encode",
      description: "Encode text for URLs",
      apply: (t) => encodeURIComponent(t),
    },
    urlDecode: {
      name: "URL Decode",
      description: "Decode URL-encoded text",
      apply: (t) => decodeURIComponent(t),
    },
  };

  const applyFormat = (formatKey: string) => {
    const format = formatOptions[formatKey];
    if (format) {
      const formatted = format.apply(text);
      setText(formatted);
      setSelectedFormat(formatKey);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "formatted-text.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setText("Hello World! This is a sample text for formatting.");
    setSelectedFormat("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="mb-4 inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Text Formatter</h1>
          <p className="text-slate-600">Apply various formatting transformations to your text</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Text Editor */}
          <div className="lg:col-span-3">
            <Card className="p-6 border-slate-200 shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to format..."
                  className="w-full h-64 p-4 border-2 border-dashed border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-300 rounded-md text-cyan-600 hover:bg-cyan-50 cursor-pointer font-medium">
                  <Upload className="w-4 h-4" />
                  Upload
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Format Options */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-200 shadow-lg sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Format Options</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(formatOptions).map(([key, option]) => (
                  <Button
                    key={key}
                    onClick={() => applyFormat(key)}
                    variant={selectedFormat === key ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-3 px-3 ${
                      selectedFormat === key
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{option.name}</div>
                      <div className={`text-xs ${selectedFormat === key ? "text-cyan-100" : "text-slate-500"}`}>
                        {option.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Formatting Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <strong>Case Conversion:</strong> Change text case (uppercase, lowercase, capitalize)
            </div>
            <div>
              <strong>Text Manipulation:</strong> Reverse text, remove spaces, trim whitespace
            </div>
            <div>
              <strong>Line Operations:</strong> Sort lines, remove duplicates, add line numbers
            </div>
            <div>
              <strong>Encoding:</strong> HTML encode/decode, URL encode/decode
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
