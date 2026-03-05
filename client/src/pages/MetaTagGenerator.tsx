import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   - Typography: Space Mono for headings, Inter for body
*/

export default function MetaTagGenerator() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  const generateMetaTags = () => {
    const tags: string[] = [];

    if (title) tags.push(`<meta name="title" content="${title}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);
    tags.push(`<meta charset="UTF-8" />`);

    // Open Graph tags
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}" />`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    tags.push(`<meta property="og:type" content="website" />`);

    // Twitter tags
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    if (twitterHandle) tags.push(`<meta name="twitter:creator" content="${twitterHandle}" />`);

    return tags.join('\n');
  };

  const metaTags = generateMetaTags();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(metaTags);
    toast.success('Meta tags copied to clipboard!');
  };

  const downloadMetaTags = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(metaTags));
    element.setAttribute('download', 'meta-tags.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Meta tags downloaded!');
  };

  const loadSample = () => {
    setTitle('OnlineMiniTools - Free Online Tools Repository');
    setDescription('Access 400+ free online tools for text conversion, calculations, image processing, and more. Simple and straightforward tools for your daily needs.');
    setKeywords('online tools, converter, calculator, text tools, image tools');
    setAuthor('OnlineMiniTools Team');
    setOgTitle('OnlineMiniTools - Free Online Tools');
    setOgDescription('400+ free online tools for productivity and development');
    setOgImage('https://example.com/og-image.png');
    setTwitterHandle('@onlineminitools');
    toast.success('Sample data loaded!');
  };

  const reset = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setTwitterHandle('');
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Meta Tag Generator</h1>
            <p className="text-muted-foreground">Generate SEO-optimized meta tags for your website</p>
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
                    <label className="block text-sm font-medium mb-2">Page Title</label>
                    <Input
                      placeholder="Enter page title (50-60 chars recommended)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={60}
                      className="border-border"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{title.length}/60</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <Textarea
                      placeholder="Enter meta description (150-160 chars recommended)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={160}
                      className="border-border resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{description.length}/160</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                    <Textarea
                      placeholder="Enter keywords separated by commas"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="border-border resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <Input
                      placeholder="Enter author name"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3 text-magenta-500">Open Graph Tags</h3>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2">OG Title</label>
                      <Input
                        placeholder="Open Graph title"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        className="border-border"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2">OG Description</label>
                      <Textarea
                        placeholder="Open Graph description"
                        value={ogDescription}
                        onChange={(e) => setOgDescription(e.target.value)}
                        className="border-border resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2">OG Image URL</label>
                      <Input
                        placeholder="https://example.com/image.png"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        className="border-border"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3 text-lime-500">Twitter Tags</h3>

                    <div>
                      <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                      <Input
                        placeholder="@yourhandle"
                        value={twitterHandle}
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        className="border-border"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={copyToClipboard}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadMetaTags}
                      className="flex-1 bg-magenta-500 hover:bg-magenta-600 text-white"
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
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">📋 Meta Tags Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                    <pre className="whitespace-pre-wrap break-words text-pink-900 dark:text-pink-100">
                      {metaTags || '<!-- Meta tags will appear here -->'}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lime-500">📊 SEO Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-lime-50 dark:bg-lime-950/20 rounded-lg">
                      <span className="text-sm font-medium">Title Length</span>
                      <span className={`font-semibold ${title.length >= 50 && title.length <= 60 ? 'text-lime-600' : 'text-orange-600'}`}>
                        {title.length}/60
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                      <span className="text-sm font-medium">Description Length</span>
                      <span className={`font-semibold ${description.length >= 150 && description.length <= 160 ? 'text-cyan-600' : 'text-orange-600'}`}>
                        {description.length}/160
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-magenta-50 dark:bg-magenta-950/20 rounded-lg">
                      <span className="text-sm font-medium">Keywords Count</span>
                      <span className="font-semibold text-magenta-600">
                        {keywords ? keywords.split(',').filter(k => k.trim()).length : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <span className="text-sm font-medium">Tags Generated</span>
                      <span className="font-semibold text-purple-600">
                        {metaTags.split('\n').filter(line => line.trim()).length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <strong>Tip:</strong> Aim for 50-60 characters for titles and 150-160 for descriptions for optimal search engine display.
                    </p>
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
