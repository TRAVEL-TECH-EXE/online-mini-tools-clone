import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Upload, Eye, Code } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function MarkdownConverter() {
  const [, setLocation] = useLocation();
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Converter

This is a **bold** text and this is *italic* text.

## Features

- Convert Markdown to HTML
- Real-time preview
- Copy and download options

### Code Example

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> This is a blockquote

[Visit GitHub](https://github.com)
`);
  const [viewMode, setViewMode] = useState<"markdown" | "html" | "preview">("preview");

  // Simple markdown to HTML converter
  const convertMarkdownToHtml = (md: string): string => {
    let html = md;

    // Escape HTML special characters first
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, "<blockquote>$1</blockquote>");

    // Unordered lists
    html = html.replace(/^\- (.*?)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, "");
    html = html.replace(/<p>(<h[1-6]|<ul|<pre|<blockquote)/g, "$1");
    html = html.replace(/(<\/h[1-6]|<\/ul|<\/pre|<\/blockquote>)<\/p>/g, "$1");

    return html;
  };

  const html = convertMarkdownToHtml(markdown);

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown));
    element.setAttribute("download", "document.md");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadHtml = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(html));
    element.setAttribute("download", "document.html");
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
        setMarkdown(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
  };

  const handleSample = () => {
    setMarkdown(`# Welcome to Markdown Converter

This is a **bold** text and this is *italic* text.

## Features

- Convert Markdown to HTML
- Real-time preview
- Copy and download options

### Code Example

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> This is a blockquote

[Visit GitHub](https://github.com)
`);
  };

  const handleClear = () => setMarkdown("");

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Markdown Converter</h1>
          <p className="text-slate-600">Convert Markdown to HTML with real-time preview</p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setViewMode("markdown")}
            variant={viewMode === "markdown" ? "default" : "outline"}
            className={viewMode === "markdown" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
          >
            <Code className="w-4 h-4 mr-2" />
            Markdown
          </Button>
          <Button
            onClick={() => setViewMode("html")}
            variant={viewMode === "html" ? "default" : "outline"}
            className={viewMode === "html" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
          >
            <Code className="w-4 h-4 mr-2" />
            HTML
          </Button>
          <Button
            onClick={() => setViewMode("preview")}
            variant={viewMode === "preview" ? "default" : "outline"}
            className={viewMode === "preview" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Markdown Editor */}
          {(viewMode === "markdown" || viewMode === "preview") && (
            <Card className="p-6 border-slate-200 shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Markdown Input
                </label>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Enter Markdown here..."
                  className="w-full h-96 p-4 border-2 border-dashed border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopyMarkdown}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownloadMarkdown}
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
                    accept=".md,.txt"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  onClick={handleSample}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  Sample
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
            </Card>
          )}

          {/* HTML Output */}
          {(viewMode === "html" || viewMode === "preview") && (
            <Card className="p-6 border-slate-200 shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {viewMode === "html" ? "HTML Output" : "Preview"}
                </label>
                {viewMode === "html" ? (
                  <textarea
                    value={html}
                    readOnly
                    className="w-full h-96 p-4 border-2 border-dashed border-cyan-300 rounded-lg bg-slate-50 resize-none font-mono text-sm"
                  />
                ) : (
                  <div className="w-full h-96 p-4 border-2 border-dashed border-cyan-300 rounded-lg bg-white overflow-y-auto prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopyHtml}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownloadHtml}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Markdown Syntax Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <strong>Headings:</strong> # H1, ## H2, ### H3
            </div>
            <div>
              <strong>Emphasis:</strong> **bold**, *italic*
            </div>
            <div>
              <strong>Lists:</strong> - item (unordered lists)
            </div>
            <div>
              <strong>Links:</strong> [text](url)
            </div>
            <div>
              <strong>Code:</strong> `inline` or ```code block```
            </div>
            <div>
              <strong>Blockquotes:</strong> &gt; quoted text
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
