import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Copy, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

/* Design System: Modern Minimalist with Neon Accents
   - Multiple case conversion modes
   - Real-time preview of all conversions
   - Copy, download, and upload functionality
   - Character and word statistics
*/

type CaseMode = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'camelcase' | 'pascalcase' | 'snakecase' | 'kebabcase';

interface CaseOption {
  mode: CaseMode;
  label: string;
  description: string;
  example: string;
}

const CASE_OPTIONS: CaseOption[] = [
  { mode: 'uppercase', label: 'UPPERCASE', description: 'ALL LETTERS UPPERCASE', example: 'HELLO WORLD' },
  { mode: 'lowercase', label: 'lowercase', description: 'all letters lowercase', example: 'hello world' },
  { mode: 'titlecase', label: 'Title Case', description: 'First Letter Of Each Word', example: 'Hello World' },
  { mode: 'sentencecase', label: 'Sentence case', description: 'Only first letter uppercase', example: 'Hello world' },
  { mode: 'camelcase', label: 'camelCase', description: 'First word lowercase, rest capitalized', example: 'helloWorld' },
  { mode: 'pascalcase', label: 'PascalCase', description: 'All words capitalized, no spaces', example: 'HelloWorld' },
  { mode: 'snakecase', label: 'snake_case', description: 'Words separated by underscores', example: 'hello_world' },
  { mode: 'kebabcase', label: 'kebab-case', description: 'Words separated by hyphens', example: 'hello-world' },
];

function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'sentencecase':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camelcase': {
      const words = text.toLowerCase().split(/\s+/);
      return words
        .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('');
    }
    case 'pascalcase': {
      const words = text.toLowerCase().split(/\s+/);
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }
    case 'snakecase':
      return text.toLowerCase().split(/\s+/).join('_');
    case 'kebabcase':
      return text.toLowerCase().split(/\s+/).join('-');
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('Hello World');
  const [copyFeedback, setCopyFeedback] = useState<CaseMode | null>(null);

  const conversions = useMemo(() => {
    const result: Record<CaseMode, string> = {} as Record<CaseMode, string>;
    CASE_OPTIONS.forEach(option => {
      result[option.mode] = convertCase(input, option.mode);
    });
    return result;
  }, [input]);

  const stats = useMemo(() => {
    return {
      characters: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input.split('\n').length,
    };
  }, [input]);

  const handleCopy = useCallback((mode: CaseMode) => {
    navigator.clipboard.writeText(conversions[mode]);
    setCopyFeedback(mode);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopyFeedback(null), 2000);
  }, [conversions]);

  const handleDownload = useCallback((mode: CaseMode) => {
    const element = document.createElement('a');
    const file = new Blob([conversions[mode]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `converted-${mode}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded');
  }, [conversions]);

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
                <h1 className="text-2xl font-bold text-foreground">Case Converter</h1>
                <p className="text-sm text-muted-foreground">Convert text to different cases</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Input Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Input Text</h2>
          <Card className="border-border">
            <CardContent className="p-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert..."
                className="w-full bg-muted/30 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent min-h-32"
                spellCheck="false"
              />
            </CardContent>
          </Card>

          {/* Input Controls */}
          <div className="flex flex-wrap gap-2 mt-4">
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

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-600">{stats.characters}</div>
                <div className="text-xs text-muted-foreground mt-1">Characters</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-magenta-600">{stats.words}</div>
                <div className="text-xs text-muted-foreground mt-1">Words</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-lime-600">{stats.lines}</div>
                <div className="text-xs text-muted-foreground mt-1">Lines</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conversions Grid */}
        <h2 className="text-lg font-bold text-foreground mb-4">Conversions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASE_OPTIONS.map(option => (
            <Card key={option.mode} className="border-border hover:border-cyan-400 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{option.label}</CardTitle>
                <CardDescription className="text-xs">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/30 border border-border rounded-lg p-3 font-mono text-sm break-all min-h-12 flex items-center">
                  {conversions[option.mode]}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(option.mode)}
                    variant="outline"
                    size="sm"
                    className={`flex-1 gap-2 ${
                      copyFeedback === option.mode
                        ? 'bg-lime-50 border-lime-400 text-lime-600'
                        : ''
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    {copyFeedback === option.mode ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    onClick={() => handleDownload(option.mode)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-border bg-gradient-to-r from-cyan-50 to-magenta-50">
          <CardHeader>
            <CardTitle className="text-lg">Supported Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground">
            <div><strong>UPPERCASE:</strong> All letters in capital form</div>
            <div><strong>lowercase:</strong> All letters in lowercase form</div>
            <div><strong>Title Case:</strong> First letter of each word capitalized</div>
            <div><strong>Sentence case:</strong> Only first letter of sentence capitalized</div>
            <div><strong>camelCase:</strong> First word lowercase, subsequent words capitalized, no spaces</div>
            <div><strong>PascalCase:</strong> All words capitalized, no spaces</div>
            <div><strong>snake_case:</strong> Words separated by underscores</div>
            <div><strong>kebab-case:</strong> Words separated by hyphens</div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
