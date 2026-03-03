import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function TipCalculator() {
  const [, setLocation] = useLocation();
  const [billAmount, setBillAmount] = useState("100");
  const [tipPercentage, setTipPercentage] = useState("15");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [customTip, setCustomTip] = useState("");
  const [results, setResults] = useState<{
    tipAmount: number;
    totalAmount: number;
    perPersonTotal: number;
    perPersonTip: number;
  } | null>(null);

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numberOfPeople);
    const tip = customTip ? parseFloat(customTip) : parseFloat(tipPercentage);

    if (isNaN(bill) || isNaN(people) || isNaN(tip) || bill < 0 || people < 1 || tip < 0) {
      return;
    }

    const tipAmount = customTip ? tip : (bill * tip) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonTotal = totalAmount / people;
    const perPersonTip = tipAmount / people;

    setResults({
      tipAmount,
      totalAmount,
      perPersonTotal,
      perPersonTip,
    });
  };

  const copyToClipboard = () => {
    if (results) {
      const text = `Bill: $${parseFloat(billAmount).toFixed(2)}\nTip: $${results.tipAmount.toFixed(2)}\nTotal: $${results.totalAmount.toFixed(2)}\nPer Person: $${results.perPersonTotal.toFixed(2)}`;
      navigator.clipboard.writeText(text);
    }
  };

  const downloadResult = () => {
    if (results) {
      const text = `Tip Calculator Result\n\nBill Amount: $${parseFloat(billAmount).toFixed(2)}\nTip Percentage: ${tipPercentage}%\nNumber of People: ${numberOfPeople}\n\nTip Amount: $${results.tipAmount.toFixed(2)}\nTotal Amount: $${results.totalAmount.toFixed(2)}\n\nPer Person Total: $${results.perPersonTotal.toFixed(2)}\nPer Person Tip: $${results.perPersonTip.toFixed(2)}`;
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
      element.setAttribute("download", "tip-calculator.txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const reset = () => {
    setBillAmount("");
    setTipPercentage("15");
    setNumberOfPeople("1");
    setCustomTip("");
    setResults(null);
  };

  const quickTips = [10, 15, 18, 20, 25];

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Tip Calculator</h1>
          <p className="text-slate-600">Calculate tips and split bills easily</p>
        </div>

        {/* Input Section */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Bill Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bill Amount ($)</label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tip Percentage (%)</label>
                <input
                  type="number"
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Number of People</label>
                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Tip Amount ($) - Optional</label>
              <input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Leave empty to use percentage"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Tip Buttons */}
        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tip Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {quickTips.map((tip) => (
                <Button
                  key={tip}
                  variant={tipPercentage === tip.toString() ? "default" : "outline"}
                  onClick={() => {
                    setTipPercentage(tip.toString());
                    setCustomTip("");
                  }}
                  className={tipPercentage === tip.toString() ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                >
                  {tip}%
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={calculate} className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1">
            Calculate
          </Button>
          <Button onClick={reset} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results Section */}
        {results && (
          <Card className="border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Results Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-slate-600 text-sm">Tip Amount</p>
                  <p className="text-3xl font-bold text-blue-600">${results.tipAmount.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-slate-600 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-green-600">${results.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Per Person Breakdown */}
              {parseInt(numberOfPeople) > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-slate-600 text-sm">Per Person (Total)</p>
                    <p className="text-3xl font-bold text-purple-600">${results.perPersonTotal.toFixed(2)}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-slate-600 text-sm">Per Person (Tip)</p>
                    <p className="text-3xl font-bold text-orange-600">${results.perPersonTip.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bill Amount:</span>
                    <span className="font-semibold">${parseFloat(billAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip ({customTip ? "Custom" : tipPercentage + "%"}):</span>
                    <span className="font-semibold">${results.tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${results.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Copy/Download */}
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
        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Tip Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              <strong>Standard Tip Percentages:</strong> 10% (poor service), 15% (good service), 18% (very good service), 20% (excellent service)
            </p>
            <p>
              <strong>Split Bills:</strong> Enter the number of people to automatically calculate how much each person should pay including their share of the tip.
            </p>
            <p>
              <strong>Custom Tip:</strong> If you prefer to enter a specific tip amount instead of a percentage, use the custom tip field.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
