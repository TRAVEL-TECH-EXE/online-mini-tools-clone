import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function PrimeFactors() {
  const [, setLocation] = useLocation();
  const [number, setNumber] = useState("360");
  const [factors, setFactors] = useState<number[]>([]);
  const [factorization, setFactorization] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let divisor = 2;

    while (n >= 2) {
      if (n % divisor === 0) {
        factors.push(divisor);
        n = n / divisor;
      } else {
        divisor++;
      }
    }

    return factors;
  };

  const getFactorization = (factors: number[]): string => {
    if (factors.length === 0) return "";

    const counts: { [key: number]: number } = {};
    factors.forEach((f) => {
      counts[f] = (counts[f] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([prime, count]) => (count === 1 ? prime : `${prime}^${count}`))
      .join(" × ");
  };

  const handleCalculate = () => {
    setError("");
    const num = parseInt(number);

    if (isNaN(num) || num < 2) {
      setError("Please enter a number greater than or equal to 2");
      return;
    }

    if (num > 1000000000) {
      setError("Number must be less than 1,000,000,000");
      return;
    }

    const primeFactors = getPrimeFactors(num);
    setFactors(primeFactors);
    setFactorization(getFactorization(primeFactors));
  };

  const copyToClipboard = () => {
    const text = `${number} = ${factorization}`;
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    const text = `Prime Factorization of ${number}\n\n${number} = ${factorization}\n\nFactors: ${factors.join(", ")}`;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "prime-factors.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadSample = () => {
    setNumber("360");
    setError("");
  };

  const reset = () => {
    setNumber("");
    setFactors([]);
    setFactorization("");
    setError("");
  };

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Prime Factorization</h1>
          <p className="text-slate-600">Find the prime factors of any number</p>
        </div>

        {/* Input Section */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Enter a Number</CardTitle>
            <CardDescription>Enter any number from 2 to 1,000,000,000</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
              placeholder="Enter a number..."
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCalculate} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Calculate
              </Button>
              <Button onClick={loadSample} variant="outline">
                Sample (360)
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Result Section */}
        {factorization && (
          <Card className="mt-6 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Prime Factorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
                <div className="text-center">
                  <p className="text-slate-600 mb-2">Factorization:</p>
                  <p className="text-3xl font-bold text-cyan-600 font-mono">{number} = {factorization}</p>
                </div>
              </div>

              {/* Factor List */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">All Prime Factors:</h3>
                <div className="flex flex-wrap gap-2">
                  {factors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded-full font-mono text-sm font-semibold"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-slate-600 text-sm">Total Factors</p>
                  <p className="text-2xl font-bold text-blue-600">{factors.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-slate-600 text-sm">Unique Factors</p>
                  <p className="text-2xl font-bold text-green-600">{new Set(factors).size}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-slate-600 text-sm">Is Prime?</p>
                  <p className="text-2xl font-bold text-purple-600">{isPrime(parseInt(number)) ? "Yes" : "No"}</p>
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
        <Card className="mt-8 border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">About Prime Factorization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p>
              <strong>Prime Factorization</strong> is the process of finding which prime numbers multiply together to make the original number.
            </p>
            <p>
              <strong>Prime Number:</strong> A number greater than 1 that has no positive divisors other than 1 and itself.
            </p>
            <p>
              <strong>Example:</strong> 360 = 2³ × 3² × 5 (meaning 2 × 2 × 2 × 3 × 3 × 5)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
