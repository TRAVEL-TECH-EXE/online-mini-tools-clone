import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

/* Design System: Modern Minimalist with Neon Accents
   - Real-time QR code generation
   - Customizable size and error correction level
   - Download QR code as PNG
   - Copy to clipboard functionality
*/

export default function QRCodeGenerator() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('https://example.com');
  const [size, setSize] = useState(200);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Generate QR code using a public API
  useEffect(() => {
    if (input.trim()) {
      const encodedInput = encodeURIComponent(input);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedInput}&ecc=${errorCorrection}`;
      setQrDataUrl(qrUrl);
    }
  }, [input, size, errorCorrection]);

  const handleDownload = useCallback(() => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded');
    }
  }, [qrDataUrl]);

  const handleCopy = useCallback(() => {
    if (input.trim()) {
      navigator.clipboard.writeText(input);
      setCopyFeedback(true);
      toast.success('Text copied to clipboard');
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    toast.success('Cleared');
  }, []);

  const handleSample = useCallback(() => {
    setInput('https://github.com');
    toast.success('Sample loaded');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">QR Code Generator</h1>
                <p className="text-sm text-muted-foreground">Generate QR codes instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-lime-100 text-lime-700">
                ✓ Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">Configuration</h2>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Text or URL
              </label>
              <Card className="border-border">
                <CardContent className="p-4">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter URL or text to encode..."
                    className="w-full bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent min-h-24"
                    spellCheck="false"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Size Control */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-muted border border-border rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100px</span>
                <span>500px</span>
              </div>
            </div>

            {/* Error Correction */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'L', label: 'Low (7%)', description: 'Basic error correction' },
                  { value: 'M', label: 'Medium (15%)', description: 'Recommended' },
                  { value: 'Q', label: 'Quartile (25%)', description: 'Higher reliability' },
                  { value: 'H', label: 'High (30%)', description: 'Maximum redundancy' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setErrorCorrection(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      errorCorrection === option.value
                        ? 'border-cyan-400 bg-cyan-50'
                        : 'border-border hover:border-cyan-400'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={`gap-2 ${copyFeedback ? 'bg-lime-50 border-lime-400 text-lime-600' : ''}`}
              >
                <Copy className="w-4 h-4" />
                {copyFeedback ? 'Copied!' : 'Copy Text'}
              </Button>
              <Button
                onClick={handleSample}
                variant="outline"
                size="sm"
              >
                Sample
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">QR Code Preview</h2>

            <Card className="border-border flex-1 flex items-center justify-center min-h-80">
              <CardContent className="p-8 w-full h-full flex items-center justify-center">
                {input.trim() ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="border-2 border-border rounded-lg p-2 bg-white"
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-cyan-400 to-magenta-500 text-white hover:shadow-lg gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">📱</div>
                    <p>Enter text or URL to generate QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="border-border bg-gradient-to-r from-cyan-50 to-magenta-50">
              <CardContent className="p-4">
                <div className="text-sm text-foreground space-y-2">
                  <div><strong>Data:</strong> {input.length} characters</div>
                  <div><strong>Size:</strong> {size}x{size} pixels</div>
                  <div><strong>Error Correction:</strong> {errorCorrection === 'L' ? 'Low (7%)' : errorCorrection === 'M' ? 'Medium (15%)' : errorCorrection === 'Q' ? 'Quartile (25%)' : 'High (30%)'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-border bg-gradient-to-r from-lime-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-lg">About QR Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <div>
              <strong className="text-cyan-600">What is a QR Code?</strong> A QR (Quick Response) code is a 2D barcode that can be scanned with a smartphone camera to quickly access information.
            </div>
            <div>
              <strong className="text-magenta-600">Error Correction:</strong> Higher levels allow the QR code to be readable even if partially damaged or obscured.
            </div>
            <div>
              <strong className="text-lime-600">Use Cases:</strong> URLs, contact information, WiFi credentials, event tickets, product information, and more.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
