import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   - Typography: Space Mono for headings, Inter for body
*/

export default function URLSlugGenerator() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [maxLength, setMaxLength] = useState('50');

  const generateSlug = (text: string, sep: string, max: number): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, sep)
      .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '')
      .substring(0, max);
  };

  const slug = generateSlug(input, separator, parseInt(maxLength));

  const slugFormats = {
    'Kebab Case': generateSlug(input, '-', parseInt(maxLength)),
    'Snake Case': generateSlug(input, '_', parseInt(maxLength)),
    'Dot Notation': generateSlug(input, '.', parseInt(maxLength)),
    'Camel Case': input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .split(/[\s_-]+/)
      .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
      .substring(0, parseInt(maxLength)),
    'Pascal Case': input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
      .substring(0, parseInt(maxLength)),
    'Constant Case': generateSlug(input, '_', parseInt(maxLength)).toUpperCase(),
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Slug copied to clipboard!');
  };

  const downloadSlug = () => {
    const content = Object.entries(slugFormats)
      .map(([format, value]) => `${format}: ${value}`)
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'slugs.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Slugs downloaded!');
  };

  const loadSample = () => {
    setInput('How to Create Amazing Blog Posts for SEO');
    setSeparator('-');
    setMaxLength('50');
    toast.success('Sample data loaded!');
  };

  const reset = () => {
    setInput('');
    setSeparator('-');
    setMaxLength('50');
  };

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
            <h1 className="text-4xl font-bold text-foreground mb-2">URL Slug Generator</h1>
            <p className="text-muted-foreground">Generate SEO-friendly URL slugs in multiple formats</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">⚙️ Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Text</label>
                    <Input
                      placeholder="Enter text to convert to slug"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Separator</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSeparator('-')}
                        variant={separator === '-' ? 'default' : 'outline'}
                        className={separator === '-' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                      >
                        Hyphen (-)
                      </Button>
                      <Button
                        onClick={() => setSeparator('_')}
                        variant={separator === '_' ? 'default' : 'outline'}
                        className={separator === '_' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                      >
                        Underscore (_)
                      </Button>
                      <Button
                        onClick={() => setSeparator('.')}
                        variant={separator === '.' ? 'default' : 'outline'}
                        className={separator === '.' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                      >
                        Dot (.)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Length</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={maxLength}
                        onChange={(e) => setMaxLength(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{maxLength}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => copyToClipboard(slug)}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                      disabled={!slug}
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadSlug}
                      className="flex-1 bg-magenta-500 hover:bg-magenta-600 text-white"
                      disabled={!slug}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={loadSample}
                      variant="outline"
                      className="flex-1 border-cyan-500 text-cyan-500 hover:bg-cyan-50"
                    >
                      Sample
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lime-500">📋 SEO Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-1">✓ Use hyphens as separators</p>
                    <p>Search engines treat hyphens as word separators</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">✓ Keep it short</p>
                    <p>Aim for 50-75 characters maximum</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">✓ Use descriptive words</p>
                    <p>Include keywords relevant to the page content</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">✓ Avoid special characters</p>
                    <p>Stick to alphanumeric characters and hyphens</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">📊 Primary Slug</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Kebab Case (Recommended)</p>
                    <div className="font-mono text-lg font-semibold text-cyan-700 dark:text-cyan-300 break-all">
                      {slug || '(empty)'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Length: {slug.length}/{maxLength}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-magenta-500">🎨 All Formats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(slugFormats).map(([format, value]) => (
                    <div
                      key={format}
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border hover:border-cyan-300 transition-colors group cursor-pointer"
                      onClick={() => copyToClipboard(value)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-foreground">{format}</p>
                        <Copy size={14} className="text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                      </div>
                      <p className="font-mono text-xs text-muted-foreground break-all">{value || '(empty)'}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lime-500">📈 Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between p-2 bg-lime-50 dark:bg-lime-950/20 rounded">
                    <span className="text-sm font-medium">Input Length</span>
                    <span className="font-semibold text-lime-600">{input.length}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded">
                    <span className="text-sm font-medium">Slug Length</span>
                    <span className="font-semibold text-cyan-600">{slug.length}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-magenta-50 dark:bg-magenta-950/20 rounded">
                    <span className="text-sm font-medium">Word Count</span>
                    <span className="font-semibold text-magenta-600">
                      {slug ? slug.split(/[-_.]+/).filter(w => w).length : 0}
                    </span>
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
