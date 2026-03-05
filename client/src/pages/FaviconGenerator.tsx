import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   - Typography: Space Mono for headings, Inter for body
*/

export default function FaviconGenerator() {
  const [, navigate] = useLocation();
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#00D9FF');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState('32');
  const [borderRadius, setBorderRadius] = useState('0');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    generateFavicon();
  }, [text, bgColor, textColor, fontSize, borderRadius]);

  const generateFavicon = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Draw background
    if (parseInt(borderRadius) > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, parseInt(borderRadius));
      ctx.fillStyle = bgColor;
      ctx.fill();
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }

    // Draw text
    if (text) {
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.substring(0, 3).toUpperCase(), size / 2, size / 2);
    }
  };

  const downloadFavicon = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'favicon.png';
    link.click();
    toast.success('Favicon downloaded!');
  };

  const copyAsDataURL = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL('image/png');
    navigator.clipboard.writeText(dataUrl);
    toast.success('Data URL copied to clipboard!');
  };

  const loadSample = () => {
    setText('OMT');
    setBgColor('#FF006E');
    setTextColor('#FFFFFF');
    setFontSize('32');
    setBorderRadius('0');
    toast.success('Sample favicon loaded!');
  };

  const reset = () => {
    setText('');
    setBgColor('#00D9FF');
    setTextColor('#FFFFFF');
    setFontSize('32');
    setBorderRadius('0');
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Favicon Generator</h1>
            <p className="text-muted-foreground">Create custom favicons for your website</p>
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
                    <label className="block text-sm font-medium mb-2">Text (1-3 characters)</label>
                    <Input
                      placeholder="e.g., OMT, AB, X"
                      value={text}
                      onChange={(e) => setText(e.target.value.substring(0, 3))}
                      maxLength={3}
                      className="border-border text-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="border-border font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="border-border font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="16"
                        max="64"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{fontSize}px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Border Radius</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="0"
                        max="128"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{borderRadius}px</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={downloadFavicon}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={copyAsDataURL}
                      className="flex-1 bg-magenta-500 hover:bg-magenta-600 text-white"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
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
                  <CardTitle className="text-lime-500">📋 Usage</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>1. Download the favicon as PNG</p>
                  <p>2. Add to your project root folder</p>
                  <p>3. Add to your HTML head:</p>
                  <code className="block bg-slate-100 dark:bg-slate-900 p-2 rounded text-xs mt-2 overflow-auto">
                    &lt;link rel="icon" href="/favicon.png"&gt;
                  </code>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">👁️ Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <canvas
                    ref={canvasRef}
                    className="rounded-lg shadow-lg border-4 border-cyan-200 dark:border-cyan-800"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  <p className="text-xs text-muted-foreground mt-4">256x256 pixels</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-magenta-500">🎨 Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => {
                      setBgColor('#00D9FF');
                      setTextColor('#FFFFFF');
                      toast.success('Cyan preset applied!');
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Cyan Theme
                  </Button>
                  <Button
                    onClick={() => {
                      setBgColor('#FF006E');
                      setTextColor('#FFFFFF');
                      toast.success('Magenta preset applied!');
                    }}
                    className="w-full bg-magenta-500 hover:bg-magenta-600 text-white"
                  >
                    Magenta Theme
                  </Button>
                  <Button
                    onClick={() => {
                      setBgColor('#39FF14');
                      setTextColor('#000000');
                      toast.success('Lime preset applied!');
                    }}
                    className="w-full bg-lime-500 hover:bg-lime-600 text-black"
                  >
                    Lime Theme
                  </Button>
                  <Button
                    onClick={() => {
                      setBgColor('#1F2937');
                      setTextColor('#FFFFFF');
                      toast.success('Dark preset applied!');
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    Dark Theme
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lime-500">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>• Use 1-3 characters for best visibility</p>
                  <p>• Ensure good contrast between text and background</p>
                  <p>• Test favicon at different sizes</p>
                  <p>• Rounded corners work best for modern designs</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
