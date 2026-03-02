import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Copy, Download, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

/* Design System: Modern Minimalist with Neon Accents
   - Real-time JSON validation with detailed error messages
   - Syntax highlighting with error line indicators
   - Code formatting (minify/prettify)
   - Copy, download, and upload functionality
   - Responsive layout with side-by-side editor and preview
*/

interface ValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  formatted?: string;
  size: number;
}

export default function JsonValidator() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30\n}');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const validation = useMemo(() => {
    const result: ValidationResult = {
      isValid: false,
      size: input.length,
    };

    try {
      const parsed = JSON.parse(input);
      result.isValid = true;
      result.formatted = JSON.stringify(parsed, null, 2);
      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        const message = error.message;
        const match = message.match(/position (\d+)/);
        const position = match ? parseInt(match[1]) : null;

        result.error = {
          message: message.replace(/position \d+/, '').trim(),
          line: position ? input.substring(0, position).split('\n').length : undefined,
          column: position
            ? position - input.substring(0, position).lastIndexOf('\n')
            : undefined,
        };
      }
      return result;
    }
  }, [input]);

  const handleFormat = useCallback(() => {
    if (validation.isValid && validation.formatted) {
      setInput(validation.formatted);
      toast.success('JSON formatted successfully');
    } else {
      toast.error('Cannot format invalid JSON');
    }
  }, [validation]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      toast.success('JSON minified successfully');
    } catch {
      toast.error('Cannot minify invalid JSON');
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(input);
    setCopyFeedback(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopyFeedback(false), 2000);
  }, [input]);

  const handleDownload = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([input], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('JSON downloaded');
  }, [input]);

  const handleUpload = useCallback(() => {
    const input_element = document.createElement('input');
    input_element.type = 'file';
    input_element.accept = '.json';
    input_element.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setInput(content);
          toast.success('JSON file loaded');
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
    const sample = {
      user: {
        id: 12345,
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['admin', 'user'],
        active: true,
        metadata: {
          lastLogin: '2026-03-01T10:30:00Z',
          loginCount: 42,
        },
      },
    };
    setInput(JSON.stringify(sample, null, 2));
    toast.success('Sample JSON loaded');
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
                <h1 className="text-2xl font-bold text-foreground">JSON Validator</h1>
                <p className="text-sm text-muted-foreground">Validate, format, and analyze JSON</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                validation.isValid
                  ? 'bg-lime-100 text-lime-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {validation.isValid ? '✓ Valid' : '✗ Invalid'}
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
              <h2 className="text-lg font-bold text-foreground">Input</h2>
              <span className="text-xs text-muted-foreground">{input.length} characters</span>
            </div>

            <Card className="flex-1 flex flex-col border-border">
              <CardContent className="flex-1 p-4 flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your JSON here..."
                  className="flex-1 bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* Input Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleFormat}
                variant="outline"
                size="sm"
                className="gap-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50"
              >
                <Zap className="w-4 h-4" />
                Format
              </Button>
              <Button
                onClick={handleMinify}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Minify
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={`gap-2 ${copyFeedback ? 'bg-lime-50 border-lime-400 text-lime-600' : ''}`}
              >
                <Copy className="w-4 h-4" />
                {copyFeedback ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="gap-2"
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

          {/* Output/Preview Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {validation.isValid ? 'Formatted Output' : 'Validation Error'}
              </h2>
              {validation.isValid && validation.formatted && (
                <span className="text-xs text-muted-foreground">
                  {validation.formatted.length} characters
                </span>
              )}
            </div>

            <Card className="flex-1 flex flex-col border-border">
              <CardContent className="flex-1 p-4 flex flex-col">
                {validation.isValid ? (
                  <div className="flex-1 bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm overflow-auto">
                    <pre className="text-foreground whitespace-pre-wrap break-words">
                      {validation.formatted}
                    </pre>
                  </div>
                ) : (
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col justify-center">
                    <div className="text-red-700 font-semibold mb-2">Validation Error</div>
                    <div className="text-red-600 text-sm mb-3">{validation.error?.message}</div>
                    {validation.error?.line && (
                      <div className="text-xs text-red-500 space-y-1">
                        <div>Line: {validation.error.line}</div>
                        {validation.error.column && (
                          <div>Column: {validation.error.column}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {validation.isValid && (
              <div className="grid grid-cols-3 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">
                      {JSON.parse(input).constructor.name === 'Object' ? 'Object' : 'Array'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Type</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-magenta-600">
                      {Object.keys(JSON.parse(input)).length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Keys</div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-lime-600">
                      {validation.formatted ? (validation.formatted.length / input.length * 100).toFixed(0) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Size Ratio</div>
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
              <strong className="text-cyan-600">Paste JSON:</strong> Paste your JSON code in the input area to validate it instantly.
            </div>
            <div>
              <strong className="text-magenta-600">Real-time Validation:</strong> Errors are highlighted immediately with line and column information.
            </div>
            <div>
              <strong className="text-lime-600">Format & Minify:</strong> Use Format to prettify or Minify to compress your JSON.
            </div>
            <div>
              <strong className="text-cyan-600">Download & Upload:</strong> Save your JSON to a file or load an existing JSON file.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
