import { useState, useCallback } from 'react';
import { ArrowLeft, Copy, Download, Upload, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

/* Design System: Modern Minimalist with Neon Accents
   - Real-time Base64 encoding/decoding
   - Bidirectional conversion with swap functionality
   - Copy, download, and upload functionality
   - Character and size statistics
*/

export default function Base64Converter() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('Hello, World!');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const output = useCallback(() => {
    try {
      if (mode === 'encode') {
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        return decodeURIComponent(escape(atob(input)));
      }
    } catch {
      return null;
    }
  }, [input, mode])();

  const isValid = output !== null;

  const handleSwap = useCallback(() => {
    if (isValid) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    } else {
      toast.error('Cannot swap: invalid input');
    }
  }, [output, isValid, mode]);

  const handleCopy = useCallback(() => {
    if (isValid) {
      navigator.clipboard.writeText(output);
      setCopyFeedback(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, [output, isValid]);

  const handleDownload = useCallback(() => {
    if (isValid) {
      const element = document.createElement('a');
      const file = new Blob([output], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Downloaded');
    }
  }, [output, isValid, mode]);

  const handleUpload = useCallback(() => {
    const input_element = document.createElement('input');
    input_element.type = 'file';
    input_element.accept = '.txt';
    input_element.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setInput(content);
          toast.success('File loaded');
        };
        reader.readAsText(file);
      }
    };
    input_element.click();
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    toast.success('Cleared');
  }, []);

  const handleSample = useCallback(() => {
    setInput('The quick brown fox jumps over the lazy dog');
    setMode('encode');
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
                <h1 className="text-2xl font-bold text-foreground">Base64 Converter</h1>
                <p className="text-sm text-muted-foreground">Encode and decode Base64 strings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                isValid
                  ? 'bg-lime-100 text-lime-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {isValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {mode === 'encode' ? 'Plain Text' : 'Base64'}
              </h2>
              <span className="text-xs text-muted-foreground">{input.length} characters</span>
            </div>

            <Card className="flex-1 flex flex-col border-border">
              <CardContent className="flex-1 p-4 flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  className="flex-1 bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button
                onClick={() => setMode('encode')}
                variant={mode === 'encode' ? 'default' : 'outline'}
                className={mode === 'encode' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
              >
                Encode
              </Button>
              <Button
                onClick={() => setMode('decode')}
                variant={mode === 'decode' ? 'default' : 'outline'}
                className={mode === 'decode' ? 'bg-magenta-500 hover:bg-magenta-600' : ''}
              >
                Decode
              </Button>
            </div>

            {/* Input Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSwap}
                variant="outline"
                size="sm"
                className="gap-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50"
                disabled={!isValid}
              >
                <ArrowRightLeft className="w-4 h-4" />
                Swap
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={`gap-2 ${copyFeedback ? 'bg-lime-50 border-lime-400 text-lime-600' : ''}`}
                disabled={!isValid}
              >
                <Copy className="w-4 h-4" />
                {copyFeedback ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={!isValid}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={handleUpload}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
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

          {/* Output Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {mode === 'encode' ? 'Base64' : 'Plain Text'}
              </h2>
              {isValid && (
                <span className="text-xs text-muted-foreground">
                  {output.length} characters
                </span>
              )}
            </div>

            <Card className="flex-1 flex flex-col border-border">
              <CardContent className="flex-1 p-4 flex flex-col">
                {isValid ? (
                  <div className="flex-1 bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm overflow-auto">
                    <pre className="text-foreground whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col justify-center">
                    <div className="text-red-700 font-semibold mb-2">Invalid Input</div>
                    <div className="text-red-600 text-sm">
                      {mode === 'decode'
                        ? 'The input is not valid Base64'
                        : 'Unable to process input'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {isValid && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">
                      {input.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Input Size</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-magenta-600">
                      {output.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Output Size</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-border bg-gradient-to-r from-cyan-50 to-magenta-50">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <div>
              <strong className="text-cyan-600">Encode:</strong> Convert plain text to Base64 format for safe data transmission.
            </div>
            <div>
              <strong className="text-magenta-600">Decode:</strong> Convert Base64 strings back to readable text.
            </div>
            <div>
              <strong className="text-lime-600">Swap:</strong> Quickly reverse the conversion direction with your current data.
            </div>
            <div>
              <strong className="text-cyan-600">Upload/Download:</strong> Work with files directly for batch operations.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
