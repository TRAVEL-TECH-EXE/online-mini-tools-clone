import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function MatrixCalculator() {
  const [, setLocation] = useLocation();
  const [matrixA, setMatrixA] = useState("[[1, 2], [3, 4]]");
  const [matrixB, setMatrixB] = useState("[[5, 6], [7, 8]]");
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "transpose">("add");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const parseMatrix = (str: string): number[][] | null => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed) || !parsed.every(row => Array.isArray(row))) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const addMatrices = (a: number[][], b: number[][]): number[][] | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      setError("Matrices must have the same dimensions for addition");
      return null;
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const subtractMatrices = (a: number[][], b: number[][]): number[][] | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      setError("Matrices must have the same dimensions for subtraction");
      return null;
    }
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  };

  const multiplyMatrices = (a: number[][], b: number[][]): number[][] | null => {
    if (a[0].length !== b.length) {
      setError("Number of columns in first matrix must equal number of rows in second matrix");
      return null;
    }
    const result: number[][] = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  const transposeMatrix = (a: number[][]): number[][] => {
    return a[0].map((_, colIndex) => a.map(row => row[colIndex]));
  };

  const handleCalculate = () => {
    setError("");
    const parsedA = parseMatrix(matrixA);
    const parsedB = parseMatrix(matrixB);

    if (!parsedA) {
      setError("Invalid Matrix A format. Use JSON format: [[1, 2], [3, 4]]");
      return;
    }

    let calcResult: number[][] | null = null;

    if (operation === "transpose") {
      calcResult = transposeMatrix(parsedA);
    } else {
      if (!parsedB) {
        setError("Invalid Matrix B format. Use JSON format: [[1, 2], [3, 4]]");
        return;
      }

      switch (operation) {
        case "add":
          calcResult = addMatrices(parsedA, parsedB);
          break;
        case "subtract":
          calcResult = subtractMatrices(parsedA, parsedB);
          break;
        case "multiply":
          calcResult = multiplyMatrices(parsedA, parsedB);
          break;
      }
    }

    if (calcResult) {
      setResult(JSON.stringify(calcResult, null, 2));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadResult = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(result));
    element.setAttribute("download", "matrix-result.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadSample = () => {
    setMatrixA("[[1, 2, 3], [4, 5, 6]]");
    setMatrixB("[[7, 8], [9, 10], [11, 12]]");
    setOperation("multiply");
    setError("");
  };

  const reset = () => {
    setMatrixA("[[1, 2], [3, 4]]");
    setMatrixB("[[5, 6], [7, 8]]");
    setResult("");
    setError("");
    setOperation("add");
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Matrix Calculator</h1>
          <p className="text-slate-600">Perform matrix operations: addition, subtraction, multiplication, and transpose</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Matrix A</CardTitle>
              <CardDescription>Enter matrix in JSON format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={matrixA}
                onChange={(e) => setMatrixA(e.target.value)}
                className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="[[1, 2], [3, 4]]"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Matrix B</CardTitle>
              <CardDescription>Enter matrix in JSON format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={matrixB}
                onChange={(e) => setMatrixB(e.target.value)}
                className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="[[5, 6], [7, 8]]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Operation Selection */}
        <Card className="mt-6 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Operation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "add", label: "Add" },
                { value: "subtract", label: "Subtract" },
                { value: "multiply", label: "Multiply" },
                { value: "transpose", label: "Transpose A" },
              ].map((op) => (
                <Button
                  key={op.value}
                  variant={operation === op.value ? "default" : "outline"}
                  onClick={() => setOperation(op.value as any)}
                  className={operation === op.value ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                >
                  {op.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={handleCalculate} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            Calculate
          </Button>
          <Button onClick={loadSample} variant="outline">
            Sample
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Result Section */}
        {result && (
          <Card className="mt-6 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="w-full h-40 p-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 focus:outline-none"
              />
              <div className="flex gap-3">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={downloadResult} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Matrix Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              <strong>Addition & Subtraction:</strong> Matrices must have the same dimensions
            </p>
            <p>
              <strong>Multiplication:</strong> Number of columns in first matrix must equal rows in second
            </p>
            <p>
              <strong>Transpose:</strong> Converts rows to columns and vice versa
            </p>
            <p className="text-sm">
              <strong>Format:</strong> Use JSON array format: [[1, 2], [3, 4]] for a 2x2 matrix
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
