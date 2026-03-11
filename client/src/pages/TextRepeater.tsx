import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Copy, Download, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

/* Design System: Modern Minimalist with Neon Accents
   - Primary Accent: Cyan (#00D9FF) for main actions
   - Secondary Accent: Magenta (#FF006E) for secondary actions
   - Success Accent: Lime (#39FF14) for positive states
   
   This tool demonstrates the TextTransformationTool template customization.
   Features: Text repetition with multiple separator options and customizable repeat count.
*/

interface RepeatOption {
  id: string;
  label: string;
  description: string;
  separator: string;
}

export default function TextRepeater() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState('');
  const [repeatCount, setRepeatCount] = useState(3);
  const [outputs, setOutputs] = useState<Record<string, string>>({});

  // Define repeat separator options
  const repeatOptions: RepeatOption[] = [
    {
      id: 'newline',
      label: 'New Line',
      description: 'Repeat text on separate lines',
      separator: '\n',
    },
    {
      id: 'space',
      label: 'Space Separated',
      description: 'Repeat text separated by spaces',
      separator: ' ',
    },
    {
      id: 'comma',
      label: 'Comma Separated',
      description: 'Repeat text separated by commas',
      separator: ', ',
    },
    {
      id: 'dash',
      label: 'Dash Separated',
      description: 'Repeat text separated by dashes',
      separator: ' - ',
    },
    {
      id: 'pipe',
      label: 'Pipe Separated',
      description: 'Repeat text separated by pipes',
      separator: ' | ',
    },
    {
      id: 'arrow',
      label: 'Arrow Separated',
      description: 'Repeat text separated by arrows',
      separator: ' → ',
    },
  ];

  const applyRepetition = () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    const newOutputs: Record<string, string> = {};
    repeatOptions.forEach(option => {
      try {
        const repeated = Array(repeatCount).fill(input).join(option.separator);
        newOutputs[option.id] = repeated;
      } catch (error) {
        toast.error(`Error applying ${option.label}`);
      }
    });
    setOutputs(newOutputs);
    toast.success('Text repeated successfully!');
  };

  const copyOutput = (optionId: string) => {
    const text = outputs[optionId];
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  const downloadOutput = (optionId: string) => {
    const text = outputs[optionId];
    if (!text) return;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', `text-repeater-${optionId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded!');
  };

  const loadSample = () => {
    setInput('Hello World');
    setRepeatCount(3);
    setOutputs({});
    toast.success('Sample data loaded!');
  };

  const reset = () => {
    setInput('');
    setOutputs({});
    setRepeatCount(3);
  };

  const getStats = () => {
    return {
      inputLength: input.length,
      inputWords: input.trim().split(/\s+/).filter(w => w).length,
      totalOutput: Object.values(outputs).reduce((sum, text) => sum + text.length, 0),
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Text Repeater</h1>
            <p className="text-muted-foreground">Repeat text multiple times with various separator options</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-cyan-500">✏️ Input Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter your text</label>
                    <Textarea
                      placeholder="Enter text to repeat..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="border-border min-h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Repeat Count: <span className="text-cyan-500 font-bold">{repeatCount}x</span>
                    </label>
                    <Slider
                      value={[repeatCount]}
                      onValueChange={(value) => setRepeatCount(value[0])}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Adjust how many times to repeat the text</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Characters:</span>
                      <span className="font-mono font-semibold text-foreground">{stats.inputLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Words:</span>
                      <span className="font-mono font-semibold text-foreground">{stats.inputWords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Output Size:</span>
                      <span className="font-mono font-semibold text-foreground">{stats.totalOutput} chars</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={applyRepetition}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      Repeat Text
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
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-magenta-500">📋 Repetition Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repeatOptions.length === 0 ? (
                    <p className="text-muted-foreground">No options available</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {repeatOptions.map((option) => (
                        <div key={option.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{option.label}</h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>

                          {outputs[option.id] && (
                            <>
                              <div className="bg-muted/50 rounded p-3 mb-3 max-h-24 overflow-auto">
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                                  {outputs[option.id]}
                                </pre>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => copyOutput(option.id)}
                                  size="sm"
                                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                                >
                                  <Copy size={14} className="mr-1" />
                                  Copy
                                </Button>
                                <Button
                                  onClick={() => downloadOutput(option.id)}
                                  size="sm"
                                  className="flex-1 bg-magenta-500 hover:bg-magenta-600 text-white"
                                >
                                  <Download size={14} className="mr-1" />
                                  Download
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {Object.keys(outputs).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Enter text and click "Repeat Text" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
