import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function PercentageCalculator() {
  const [, setLocation] = useLocation();
  const [calcType, setCalcType] = useState<"percentage" | "percentageOf" | "increase" | "decrease">("percentage");
  const [value1, setValue1] = useState("25");
  const [value2, setValue2] = useState("100");
  const [result, setResult] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<string>("");

  const calculate = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) {
      return;
    }

    let res = 0;
    let desc = "";

    switch (calcType) {
      case "percentage":
        // What percentage is v1 of v2?
        res = (v1 / v2) * 100;
        desc = `${v1} is ${res.toFixed(2)}% of ${v2}`;
        break;
      case "percentageOf":
        // What is v1% of v2?
        res = (v1 / 100) * v2;
        desc = `${v1}% of ${v2} is ${res.toFixed(2)}`;
        break;
      case "increase":
        // v2 increased by v1%
        res = v2 + (v2 * v1) / 100;
        desc = `${v2} increased by ${v1}% is ${res.toFixed(2)}`;
        break;
      case "decrease":
        // v2 decreased by v1%
        res = v2 - (v2 * v1) / 100;
        desc = `${v2} decreased by ${v1}% is ${res.toFixed(2)}`;
        break;
    }

    setResult(res);
    setBreakdown(desc);
  };

  const copyToClipboard = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toFixed(2));
    }
  };

  const downloadResult = () => {
    const text = `Percentage Calculator Result\n\n${breakdown}\n\nAnswer: ${result?.toFixed(2)}`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "percentage-result.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setValue1("");
    setValue2("");
    setResult(null);
    setBreakdown("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Percentage Calculator</h1>
          <p className="text-slate-600">Calculate percentages, percentage increases, and decreases</p>
        </div>

        {/* Calculator Type Selection */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Select Calculation Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: "percentage", label: "What % is X of Y?" },
                { value: "percentageOf", label: "What is X% of Y?" },
                { value: "increase", label: "Y increased by X%" },
                { value: "decrease", label: "Y decreased by X%" },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={calcType === type.value ? "default" : "outline"}
                  onClick={() => setCalcType(type.value as any)}
                  className={calcType === type.value ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Enter Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {calcType === "percentage" && "Value X"}
                {calcType === "percentageOf" && "Percentage (%)"}
                {calcType === "increase" && "Increase (%)"}
                {calcType === "decrease" && "Decrease (%)"}
              </label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter first value"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {calcType === "percentage" && "Value Y"}
                {calcType === "percentageOf" && "Value"}
                {calcType === "increase" && "Original Value"}
                {calcType === "decrease" && "Original Value"}
              </label>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter second value"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={calculate} className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1">
                Calculate
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Section */}
        {result !== null && (
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-lg border border-cyan-200">
                <p className="text-slate-600 text-center mb-3">Answer</p>
                <p className="text-5xl font-bold text-cyan-600 text-center font-mono">{result.toFixed(2)}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-slate-700">{breakdown}</p>
              </div>

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

        {/* Examples Section */}
        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Common Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <div>
              <strong>What % is 25 of 100?</strong>
              <p className="text-sm">Answer: 25%</p>
            </div>
            <div>
              <strong>What is 20% of 150?</strong>
              <p className="text-sm">Answer: 30</p>
            </div>
            <div>
              <strong>100 increased by 25%?</strong>
              <p className="text-sm">Answer: 125</p>
            </div>
            <div>
              <strong>200 decreased by 15%?</strong>
              <p className="text-sm">Answer: 170</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
