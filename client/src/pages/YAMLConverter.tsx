import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { Copy, Download, RotateCcw, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * YAML Converter Tool
 * Converts between YAML and JSON formats with validation
 * Features: bidirectional conversion, formatting options, validation
 */
export default function YAMLConverter() {
  const [, setLocation] = useLocation();
  const [yamlInput, setYamlInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [indentSize, setIndentSize] = useState("2");

  const sampleYAML = `# Application Configuration
app:
  name: OnlineMiniTools
  version: 1.0.0
  environment: production
  
database:
  host: localhost
  port: 5432
  username: admin
  credentials:
    password: secure_password
    
features:
  - json-validator
  - csv-converter
  - yaml-converter
  
settings:
  debug: false
  timeout: 30
  max_connections: 100`;

  const sampleJSON = {
    app: {
      name: "OnlineMiniTools",
      version: "1.0.0",
      environment: "production",
    },
    database: {
      host: "localhost",
      port: 5432,
      username: "admin",
    },
    features: ["json-validator", "csv-converter", "yaml-converter"],
  };

  // Simple YAML to JSON converter
  const yamlToJson = (yamlStr: string): string => {
    try {
      const lines = yamlStr.split("\n");
      const result: Record<string, any> = {};
      const stack: any[] = [result];
      let currentIndent = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimLeft();

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith("#")) continue;

        const indent = line.length - trimmed.length;
        const isArray = trimmed.startsWith("- ");

        // Handle indentation changes
        while (currentIndent >= indent && stack.length > 1) {
          stack.pop();
          currentIndent -= 2;
        }

        if (isArray) {
          const content = trimmed.substring(2).trim();
          const current = stack[stack.length - 1];

          if (Array.isArray(current)) {
            if (content.includes(":")) {
              const [key, value] = content.split(":").map((s) => s.trim());
              const obj: Record<string, any> = {};
              obj[key] = parseValue(value);
              current.push(obj);
            } else {
              current.push(parseValue(content));
            }
          }
        } else if (trimmed.includes(":")) {
          const [key, value] = trimmed.split(":").map((s) => s.trim());
          const current = stack[stack.length - 1];

          if (value === "") {
            // Check if next line is indented (nested object/array)
            const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
            const nextIndent = nextLine.length - nextLine.trimLeft().length;

            if (nextIndent > indent) {
              if (nextLine.trimLeft().startsWith("- ")) {
                current[key] = [];
                stack.push(current[key]);
              } else {
                current[key] = {};
                stack.push(current[key]);
              }
              currentIndent = indent;
            }
          } else {
            current[key] = parseValue(value);
          }
        }
      }

      return JSON.stringify(result, null, parseInt(indentSize));
    } catch (error) {
      throw new Error("Invalid YAML format: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  // Simple JSON to YAML converter
  const jsonToYaml = (jsonStr: string): string => {
    try {
      const obj = JSON.parse(jsonStr);
      return objectToYaml(obj, 0);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const objectToYaml = (obj: any, indent: number): string => {
    const spaces = " ".repeat(indent);
    const nextSpaces = " ".repeat(indent + 2);

    if (obj === null || obj === undefined) return "null";
    if (typeof obj === "boolean") return obj.toString();
    if (typeof obj === "number") return obj.toString();
    if (typeof obj === "string") return `"${obj}"`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      return obj
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return `${spaces}- ${objectToYaml(item, indent + 2).trim()}`;
          }
          return `${spaces}- ${item}`;
        })
        .join("\n");
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";
      return keys
        .map((key) => {
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
              return `${spaces}${key}:\n${objectToYaml(value, indent + 2)}`;
            }
            return `${spaces}${key}:\n${objectToYaml(value, indent + 2)}`;
          }
          return `${spaces}${key}: ${objectToYaml(value, indent)}`;
        })
        .join("\n");
    }

    return obj.toString();
  };

  const parseValue = (value: string): any => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (!isNaN(Number(value))) return Number(value);
    return value.replace(/^["']|["']$/g, "");
  };

  const convertYamlToJson = () => {
    if (!yamlInput.trim()) {
      toast.error("Please enter YAML data");
      return;
    }

    try {
      const json = yamlToJson(yamlInput);
      setJsonOutput(json);
      toast.success("YAML converted to JSON");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion error");
    }
  };

  const convertJsonToYaml = () => {
    if (!jsonInput.trim()) {
      toast.error("Please enter JSON data");
      return;
    }

    try {
      const yaml = jsonToYaml(jsonInput);
      setYamlOutput(yaml);
      toast.success("JSON converted to YAML");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded");
  };

  const reset = () => {
    setYamlInput("");
    setJsonInput("");
    setYamlOutput("");
    setJsonOutput("");
  };

  const swap = () => {
    if (mode === "yaml-to-json") {
      setMode("json-to-yaml");
      setJsonInput(yamlOutput);
      setYamlOutput("");
    } else {
      setMode("yaml-to-json");
      setYamlInput(jsonOutput);
      setJsonOutput("");
    }
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
              YAML Converter
            </h1>
            <p className="text-muted-foreground mt-2">Convert between YAML and JSON formats seamlessly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1 p-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-cyan-500">⚙️</span> Configuration
            </h2>

            <div className="space-y-4">
              {/* Conversion Mode */}
              <div>
                <label className="text-sm font-medium mb-2 block">Conversion Mode</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-border/30 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <input
                      type="radio"
                      name="mode"
                      value="yaml-to-json"
                      checked={mode === "yaml-to-json"}
                      onChange={(e) => setMode(e.target.value as "yaml-to-json")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">YAML → JSON</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-border/30 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <input
                      type="radio"
                      name="mode"
                      value="json-to-yaml"
                      checked={mode === "json-to-yaml"}
                      onChange={(e) => setMode(e.target.value as "json-to-yaml")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">JSON → YAML</span>
                  </label>
                </div>
              </div>

              {/* Indent Size */}
              <div>
                <label className="text-sm font-medium mb-2 block">Indent Size</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border/30 bg-secondary/30 text-sm"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="8">8 spaces</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                {mode === "yaml-to-json" ? (
                  <Button
                    onClick={convertYamlToJson}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    Convert to JSON
                  </Button>
                ) : (
                  <Button
                    onClick={convertJsonToYaml}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    Convert to YAML
                  </Button>
                )}
                <Button onClick={swap} variant="outline" className="w-full">
                  <ArrowRightLeft className="w-4 h-4 mr-2" /> Swap
                </Button>
                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Input/Output Panel */}
          <div className="lg:col-span-2 space-y-6">
            {mode === "yaml-to-json" ? (
              <>
                {/* YAML Input */}
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">YAML Input</h2>
                    <Button
                      onClick={() => setYamlInput(sampleYAML)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Sample
                    </Button>
                  </div>
                  <Textarea
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder="Paste your YAML data here..."
                    className="font-mono text-sm h-48 resize-none"
                  />
                </Card>

                {/* JSON Output */}
                {jsonOutput && (
                  <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">JSON Output</h2>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(jsonOutput)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                        <Button
                          onClick={() => downloadFile(jsonOutput, "data.json")}
                          size="sm"
                          className="text-xs bg-cyan-500 hover:bg-cyan-600"
                        >
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={jsonOutput}
                      readOnly
                      className="font-mono text-sm h-48 resize-none bg-secondary/30"
                    />
                  </Card>
                )}
              </>
            ) : (
              <>
                {/* JSON Input */}
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">JSON Input</h2>
                    <Button
                      onClick={() => setJsonInput(JSON.stringify(sampleJSON, null, 2))}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Sample
                    </Button>
                  </div>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    className="font-mono text-sm h-48 resize-none"
                  />
                </Card>

                {/* YAML Output */}
                {yamlOutput && (
                  <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">YAML Output</h2>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(yamlOutput)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                        <Button
                          onClick={() => downloadFile(yamlOutput, "data.yaml")}
                          size="sm"
                          className="text-xs bg-cyan-500 hover:bg-cyan-600"
                        >
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={yamlOutput}
                      readOnly
                      className="font-mono text-sm h-48 resize-none bg-secondary/30"
                    />
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
