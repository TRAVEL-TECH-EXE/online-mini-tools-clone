import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Upload, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface WordStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  averageWordLength: number;
  averageSentenceLength: number;
  uniqueWords: number;
}

interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export default function WordCounter() {
  const [, setLocation] = useLocation();
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog. This is a sample text for word counting and statistics analysis."
  );
  const [stats, setStats] = useState<WordStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
    averageWordLength: 0,
    averageSentenceLength: 0,
    uniqueWords: 0,
  });
  const [wordFrequency, setWordFrequency] = useState<WordFrequency[]>([]);

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (input: string) => {
    // Basic counts
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, "").length;
    const words = input.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const sentences = (input.match(/[.!?]+/g) || []).length || 1;
    const paragraphs = input.split(/\n\n+/).filter((p) => p.trim().length > 0).length || 1;
    const lines = input.split("\n").length;

    // Time calculations
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/minute
    const speakingTime = Math.ceil(words / 130); // Average speaking speed: 130 words/minute

    // Averages
    const averageWordLength = words > 0 ? (charactersNoSpaces / words).toFixed(2) : "0";
    const averageSentenceLength = sentences > 0 ? (words / sentences).toFixed(2) : "0";

    // Unique words
    const wordList = input
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const uniqueWords = new Set(wordList).size;

    // Word frequency
    const frequency: { [key: string]: number } = {};
    wordList.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const sortedFrequency = Object.entries(frequency)
      .map(([word, count]) => ({
        word,
        count,
        percentage: parseFloat(((count / wordList.length) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      averageWordLength: parseFloat(averageWordLength as string),
      averageSentenceLength: parseFloat(averageSentenceLength as string),
      uniqueWords,
    });

    setWordFrequency(sortedFrequency);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "text.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleSample = () => {
    setText(
      "The quick brown fox jumps over the lazy dog. This is a sample text for word counting and statistics analysis. Word counters are useful tools for writers, students, and professionals. They help you track the length of your documents and provide valuable insights into your writing patterns."
    );
  };

  const handleClear = () => setText("");

  const downloadStats = () => {
    const statsText = `
TEXT STATISTICS REPORT
======================

Basic Counts:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Unique Words: ${stats.uniqueWords}

Time Estimates:
- Reading Time: ${stats.readingTime} minute(s)
- Speaking Time: ${stats.speakingTime} minute(s)

Averages:
- Average Word Length: ${stats.averageWordLength.toFixed(2)} characters
- Average Sentence Length: ${stats.averageSentenceLength.toFixed(2)} words

Top 10 Most Frequent Words:
${wordFrequency.map((w, i) => `${i + 1}. "${w.word}" - ${w.count} times (${w.percentage.toFixed(2)}%)`).join("\n")}
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(statsText));
    element.setAttribute("download", "statistics.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="mb-4 inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Word Counter & Statistics</h1>
          <p className="text-slate-600">Analyze your text with detailed statistics and word frequency analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Editor */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-slate-200 shadow-lg">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-64 p-4 border-2 border-dashed border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-300 rounded-md text-cyan-600 hover:bg-cyan-50 cursor-pointer font-medium">
                  <Upload className="w-4 h-4" />
                  Upload
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <Button
                  onClick={handleSample}
                  variant="outline"
                  className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                >
                  Sample
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-200 shadow-lg sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-bold text-slate-900">Statistics</h2>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg border border-cyan-200">
                  <div className="text-xs text-cyan-600 font-medium">Characters</div>
                  <div className="text-2xl font-bold text-cyan-700">{stats.characters}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">Words</div>
                  <div className="text-2xl font-bold text-blue-700">{stats.words}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-600 font-medium">Sentences</div>
                  <div className="text-2xl font-bold text-purple-700">{stats.sentences}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                  <div className="text-xs text-orange-600 font-medium">Reading Time</div>
                  <div className="text-2xl font-bold text-orange-700">{stats.readingTime}m</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-green-600 font-medium">Unique Words</div>
                  <div className="text-2xl font-bold text-green-700">{stats.uniqueWords}</div>
                </div>
              </div>

              <Button
                onClick={downloadStats}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </Card>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Additional Stats */}
          <Card className="p-6 border-slate-200 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Detailed Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-600">Characters (no spaces)</span>
                <span className="font-semibold text-slate-900">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-600">Paragraphs</span>
                <span className="font-semibold text-slate-900">{stats.paragraphs}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-600">Lines</span>
                <span className="font-semibold text-slate-900">{stats.lines}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-600">Speaking Time</span>
                <span className="font-semibold text-slate-900">{stats.speakingTime}m</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-600">Avg Word Length</span>
                <span className="font-semibold text-slate-900">{stats.averageWordLength.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Avg Sentence Length</span>
                <span className="font-semibold text-slate-900">{stats.averageSentenceLength.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Word Frequency */}
          <Card className="p-6 border-slate-200 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Top 10 Words</h3>
            <div className="space-y-2">
              {wordFrequency.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-900">{item.word}</span>
                      <span className="text-xs text-slate-600">{item.count}x</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full"
                        style={{ width: `${(item.count / wordFrequency[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">About Word Counter</h3>
          <p className="text-slate-700 text-sm">
            This tool provides comprehensive text analysis including character count, word count, sentence analysis, reading time estimation, and word frequency analysis. Perfect for writers, students, and content creators who need detailed insights into their text composition.
          </p>
        </Card>
      </div>
    </div>
  );
}
