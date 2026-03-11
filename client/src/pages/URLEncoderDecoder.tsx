import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Copy, Download, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   
   URL Encoder/Decoder Tool - Customized from ConverterTool template
   Features: Bidirectional URL encoding/decoding with size comparison
*/

export default function URLEncoderDecoder() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncoding, setIsEncoding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const encode = (text: string): string => {
    try {
      return encodeURIComponent(text);
    } catch (err) {
      throw new Error('URL encoding failed');
    }
  };

  const decode = (text: string): string => {
    try {
      return decodeURIComponent(text);
    } catch (err) {
      throw new Error('URL decoding failed - invalid encoded URL');
    }
  };

  const convert = () => {
    if (!input.trim()) {
      toast.error('Please enter some data');
      return;
    }

    setError(null);
    try {
      const result = isEncoding ? encode(input) : decode(input);
      setOutput(result);
      toast.success(`${isEncoding ? 'Encoding' : 'Decoding'} successful!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Conversion failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const swapDirection = () => {
    setIsEncoding(!isEncoding);
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  const downloadOutput = () => {
    if (!output) return;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(output)}`);
    element.setAttribute('download', `url-${isEncoding ? 'encoded' : 'decoded'}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded!');
  };

  const loadSample = () => {
    setInput('Hello World! This is a test URL: https://example.com?param=value&other=test');
    setOutput('');
    setError(null);
    toast.success('Sample data loaded!');
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsEncoding(true);
  };

  const getStats = () => {
    return {
      inputSize: input.length,
      outputSize: output.length,
      compressionRatio: output.length > 0 ? ((1 - output.length / input.length) * 100).toFixed(1) : '0',
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">URL Encoder/Decoder</h1>
            <p className="text-muted-foreground">Encode and decode URLs for safe transmission and storage</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">
                    {isEncoding ? '🔒 Input (Plain URL)' : '🔓 Input (Encoded URL)'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isEncoding ? 'Enter URL to encode' : 'Enter URL to decode'}
                    </label>
                    <Textarea
                      placeholder={isEncoding ? 'Enter URL or text to encode...' : 'Enter encoded URL...'}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="border-border min-h-48"
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-mono font-semibold text-foreground">{stats.inputSize} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters:</span>
                      <span className="font-mono font-semibold text-foreground">{input.length}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={convert}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      {isEncoding ? 'Encode' : 'Decode'}
                    </Button>
                    <Button
                      onClick={swapDirection}
                      variant="outline"
                      className="border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
                      title="Swap encoding/decoding direction"
                    >
                      <ArrowRightLeft size={16} />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={loadSample}
                      variant="outline"
                      className="flex-1 border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
                    >
                      Sample
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* URL Info Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-500">ℹ️ URL Encoding Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">What is URL Encoding?</p>
                    <p className="text-muted-foreground">URL encoding converts special characters into a format that can be safely transmitted over the internet. Spaces become %20, special characters are converted to %XX format.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Common Encoded Characters:</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Space → %20</li>
                      <li>• & → %26</li>
                      <li>• = → %3D</li>
                      <li>• ? → %3F</li>
                      <li>• # → %23</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-magenta-500">
                    {isEncoding ? '🔐 Output (Encoded URL)' : '📝 Output (Plain URL)'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 min-h-48 overflow-auto">
                    <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
                      {output || '(output will appear here)'}
                    </pre>
                  </div>

                  {output && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Output Size:</span>
                        <span className="font-mono font-semibold text-foreground">{stats.outputSize} bytes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size Change:</span>
                        <span className={`font-mono font-semibold ${parseInt(stats.compressionRatio) > 0 ? 'text-lime-600' : 'text-orange-600'}`}>
                          {parseInt(stats.compressionRatio) > 0 ? '+' : ''}{stats.compressionRatio}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={copyOutput}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={!output}
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadOutput}
                      className="flex-1 bg-magenta-500 hover:bg-magenta-600 text-white"
                      disabled={!output}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
