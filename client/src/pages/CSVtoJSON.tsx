import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Copy, Download, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * CSV to JSON Converter Tool
 * Converts CSV data to JSON format with customizable parsing options
 * Features: delimiter selection, header row toggle, array/object output, preview
 */
export default function CSVtoJSON() {
  const [, setLocation] = useLocation();
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [outputFormat, setOutputFormat] = useState("array");
  const [stats, setStats] = useState({ rows: 0, columns: 0 });

  const sampleCSV = `Name,Email,Age,City,Status
John Doe,john@example.com,28,New York,Active
Jane Smith,jane@example.com,34,Los Angeles,Active
Bob Johnson,bob@example.com,45,Chicago,Inactive
Alice Williams,alice@example.com,29,Houston,Active`;

  const convertCSVtoJSON = () => {
    if (!csvInput.trim()) {
      toast.error("Please enter CSV data");
      return;
    }

    try {
      const lines = csvInput.trim().split("\n");
      if (lines.length === 0) {
        toast.error("No data to convert");
        return;
      }

      let headers: string[] = [];
      let dataLines = lines;

      if (hasHeader && lines.length > 0) {
        headers = lines[0].split(delimiter).map((h) => h.trim());
        dataLines = lines.slice(1);
      } else {
        // Generate default headers if no header row
        const firstLine = lines[0].split(delimiter);
        headers = Array.from({ length: firstLine.length }, (_, i) => `Column${i + 1}`);
      }

      const jsonData = dataLines
        .filter((line) => line.trim())
        .map((line) => {
          const values = line.split(delimiter).map((v) => v.trim());
          const obj: Record<string, string> = {};

          headers.forEach((header, index) => {
            obj[header] = values[index] || "";
          });

          return obj;
        });

      // Format based on output format selection
      let result: string;
      if (outputFormat === "array") {
        result = JSON.stringify(jsonData, null, 2);
      } else {
        // Object format - use first column as key
        const objFormat: Record<string, Record<string, string>> = {};
        jsonData.forEach((item) => {
          const key = item[headers[0]] || "unknown";
          objFormat[key] = item;
        });
        result = JSON.stringify(objFormat, null, 2);
      }

      setJsonOutput(result);
      setStats({
        rows: jsonData.length,
        columns: headers.length,
      });
      toast.success("CSV converted to JSON successfully");
    } catch (error) {
      toast.error("Error converting CSV: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvInput(content);
      toast.success("CSV file loaded");
    };
    reader.readAsText(file);
  };

  const downloadJSON = () => {
    if (!jsonOutput) {
      toast.error("No JSON to download");
      return;
    }
    const element = document.createElement("a");
    element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(jsonOutput));
    element.setAttribute("download", "data.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("JSON downloaded");
  };

  const copyToClipboard = () => {
    if (!jsonOutput) {
      toast.error("No JSON to copy");
      return;
    }
    navigator.clipboard.writeText(jsonOutput);
    toast.success("JSON copied to clipboard");
  };

  const reset = () => {
    setCsvInput("");
    setJsonOutput("");
    setStats({ rows: 0, columns: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              CSV to JSON Converter
            </h1>
            <p className="text-muted-foreground mt-2">Transform CSV data into JSON format with advanced options</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1 p-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-cyan-500">⚙️</span> Configuration
            </h2>

            <div className="space-y-4">
              {/* Delimiter Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Delimiter</label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                    <SelectItem value="\t">Tab</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Header Row Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                <label className="text-sm font-medium">First Row as Header</label>
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>

              {/* Output Format */}
              <div>
                <label className="text-sm font-medium mb-2 block">Output Format</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="array">Array of Objects</SelectItem>
                    <SelectItem value="object">Object with Keys</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Upload CSV File</label>
                <label className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer transition-colors bg-cyan-500/5">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Choose file</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={convertCSVtoJSON}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  Convert to JSON
                </Button>
                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>

              {/* Statistics */}
              {stats.rows > 0 && (
                <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/30">
                  <h3 className="text-sm font-semibold mb-3">Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rows:</span>
                      <span className="font-semibold text-cyan-500">{stats.rows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Columns:</span>
                      <span className="font-semibold text-cyan-500">{stats.columns}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Input/Output Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* CSV Input */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">CSV Input</h2>
                <Button
                  onClick={() => setCsvInput(sampleCSV)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Sample
                </Button>
              </div>
              <Textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="Paste your CSV data here..."
                className="font-mono text-sm h-40 resize-none"
              />
            </Card>

            {/* JSON Output */}
            {jsonOutput && (
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">JSON Output</h2>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} size="sm" variant="outline" className="text-xs">
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                    <Button onClick={downloadJSON} size="sm" className="text-xs bg-cyan-500 hover:bg-cyan-600">
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={jsonOutput}
                  readOnly
                  className="font-mono text-sm h-60 resize-none bg-secondary/30"
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
