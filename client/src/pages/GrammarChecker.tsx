import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, Copy, Download, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface GrammarIssue {
  type: "error" | "warning" | "info";
  message: string;
  position: number;
  length: number;
  suggestion?: string;
}

export default function GrammarChecker() {
  const [, setLocation] = useLocation();
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This sentence is correct.");
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [stats, setStats] = useState({ words: 0, sentences: 0, paragraphs: 0, readingTime: 0 });

  // Simple grammar checking rules
  const checkGrammar = (input: string) => {
    const newIssues: GrammarIssue[] = [];
    let position = 0;

    // Split into sentences
    const sentences = input.match(/[^.!?]+[.!?]+/g) || [];
    
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      
      // Check for double spaces
      const doubleSpaces = trimmed.match(/  +/g);
      if (doubleSpaces) {
        newIssues.push({
          type: "warning",
          message: "Multiple spaces detected",
          position,
          length: 2,
          suggestion: "Use single space",
        });
      }

      // Check for common mistakes
      if (/\bi\s/i.test(trimmed)) {
        const match = trimmed.match(/\bi\s/i);
        if (match) {
          newIssues.push({
            type: "error",
            message: "Lowercase 'i' should be capitalized",
            position: position + (match.index || 0),
            length: 1,
            suggestion: "I",
          });
        }
      }

      // Check for missing spaces after punctuation
      if (/[.!?][A-Z]/.test(trimmed)) {
        const match = trimmed.match(/[.!?][A-Z]/);
        if (match && match.index !== undefined) {
          newIssues.push({
            type: "info",
            message: "Consider adding space after punctuation",
            position: position + match.index + 1,
            length: 0,
          });
        }
      }

      // Check for common spelling mistakes
      const commonMistakes: { [key: string]: string } = {
        "teh": "the",
        "recieve": "receive",
        "occured": "occurred",
        "seperate": "separate",
        "definately": "definitely",
        "untill": "until",
        "alot": "a lot",
        "thier": "their",
      };

      Object.entries(commonMistakes).forEach(([mistake, correction]) => {
        const regex = new RegExp(`\\b${mistake}\\b`, "gi");
        let match;
        while ((match = regex.exec(trimmed)) !== null) {
          newIssues.push({
            type: "error",
            message: `Spelling: "${mistake}" should be "${correction}"`,
            position: position + match.index,
            length: mistake.length,
            suggestion: correction,
          });
        }
      });

      position += sentence.length;
    });

    setIssues(newIssues);
  };

  const calculateStats = (input: string) => {
    const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
    const sentences = (input.match(/[.!?]+/g) || []).length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    setStats({ words, sentences, paragraphs, readingTime });
  };

  useEffect(() => {
    checkGrammar(text);
    calculateStats(text);
  }, [text]);

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "text.txt");
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

  const handleSample = () => {
    setText(
      "The quick brown fox jumps over the lazy dog. Teh cat sat on the mat. This sentence has  double spaces. i think this is important. She recieved the package yesterday. Untill we meet again, goodbye."
    );
  };

  const handleClear = () => setText("");

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const applySuggestion = (issue: GrammarIssue) => {
    if (issue.suggestion) {
      const before = text.substring(0, issue.position);
      const after = text.substring(issue.position + issue.length);
      setText(before + issue.suggestion + after);
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Grammar Checker</h1>
          <p className="text-slate-600">Analyze and improve your text with real-time grammar checking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-slate-200 shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-64 p-4 border-2 border-dashed border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
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

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700">{stats.words}</div>
                  <div className="text-xs text-cyan-600 font-medium">Words</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{stats.sentences}</div>
                  <div className="text-xs text-blue-600 font-medium">Sentences</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{stats.paragraphs}</div>
                  <div className="text-xs text-purple-600 font-medium">Paragraphs</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{stats.readingTime}</div>
                  <div className="text-xs text-orange-600 font-medium">Min Read</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Issues Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-200 shadow-lg sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Issues Found: {issues.length}
              </h2>

              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">No issues detected!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-l-4 ${getIssueColor(issue.type)}`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{issue.message}</p>
                        </div>
                      </div>
                      {issue.suggestion && (
                        <Button
                          onClick={() => applySuggestion(issue)}
                          size="sm"
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                        >
                          Apply: {issue.suggestion}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">About Grammar Checker</h3>
          <ul className="space-y-2 text-slate-700 text-sm">
            <li><strong>Error Detection:</strong> Identifies common spelling mistakes and capitalization errors</li>
            <li><strong>Suggestions:</strong> Provides corrections that can be applied with a single click</li>
            <li><strong>Text Statistics:</strong> Shows word count, sentence count, paragraphs, and estimated reading time</li>
            <li><strong>File Support:</strong> Upload .txt files or download your corrected text</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
