import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, RefreshCw, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface PromptConfig {
  role: string;
  taskType: string;
  tone: string;
  context: string;
  constraints: string;
  outputFormat: string;
  expertise: string;
}

interface OptimizationTip {
  category: string;
  tip: string;
  severity: "info" | "warning" | "success";
}

const ROLES = [
  "Expert Developer",
  "Data Scientist",
  "Content Writer",
  "UX Designer",
  "Marketing Specialist",
  "Project Manager",
  "Business Analyst",
  "DevOps Engineer",
  "Security Expert",
  "Academic Researcher",
  "Creative Director",
  "Product Manager"
];

const TASK_TYPES = [
  "Code Generation",
  "Content Creation",
  "Analysis",
  "Brainstorming",
  "Summarization",
  "Translation",
  "Debugging",
  "Documentation",
  "Planning",
  "Research",
  "Optimization",
  "Teaching"
];

const TONES = [
  "Professional",
  "Casual",
  "Academic",
  "Creative",
  "Humorous",
  "Formal",
  "Conversational",
  "Technical",
  "Motivational",
  "Neutral"
];

const OUTPUT_FORMATS = [
  "Paragraph",
  "Bullet Points",
  "Code Block",
  "JSON",
  "Markdown",
  "Table",
  "List",
  "Step-by-Step",
  "Outline",
  "Summary"
];

const EXPERTISE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

export default function AIPromptGenerator() {
  const [config, setConfig] = useState<PromptConfig>({
    role: "Expert Developer",
    taskType: "Code Generation",
    tone: "Professional",
    context: "",
    constraints: "",
    outputFormat: "Code Block",
    expertise: "Intermediate"
  });

  const [userPrompt, setUserPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [optimizationTips, setOptimizationTips] = useState<OptimizationTip[]>([]);

  const generatePrompt = () => {
    const parts: string[] = [];

    // Role and expertise
    parts.push(`You are a ${config.role} with ${config.expertise} level expertise.`);

    // Task
    parts.push(`Your task is to help with: ${config.taskType}.`);

    // Tone
    parts.push(`Respond in a ${config.tone.toLowerCase()} tone.`);

    // Context
    if (config.context.trim()) {
      parts.push(`Context: ${config.context}`);
    }

    // User's actual prompt
    if (userPrompt.trim()) {
      parts.push(`\n${userPrompt}`);
    }

    // Constraints
    if (config.constraints.trim()) {
      parts.push(`\nConstraints: ${config.constraints}`);
    }

    // Output format
    parts.push(`\nProvide your response in ${config.outputFormat.toLowerCase()} format.`);

    const prompt = parts.join("\n");
    setGeneratedPrompt(prompt);

    // Generate optimization tips
    generateOptimizationTips(prompt, userPrompt);
  };

  const generateOptimizationTips = (prompt: string, userPrompt: string) => {
    const tips: OptimizationTip[] = [];

    // Check for specificity
    if (!userPrompt || userPrompt.length < 20) {
      tips.push({
        category: "Specificity",
        tip: "Add more specific details about what you want to achieve",
        severity: "warning"
      });
    } else {
      tips.push({
        category: "Specificity",
        tip: "Good level of detail in your prompt",
        severity: "success"
      });
    }

    // Check for context
    if (!config.context.trim()) {
      tips.push({
        category: "Context",
        tip: "Consider adding background context for better results",
        severity: "info"
      });
    } else {
      tips.push({
        category: "Context",
        tip: "Context provided - helps AI understand the situation better",
        severity: "success"
      });
    }

    // Check for constraints
    if (!config.constraints.trim()) {
      tips.push({
        category: "Constraints",
        tip: "Define any limitations or requirements (e.g., word count, format)",
        severity: "info"
      });
    } else {
      tips.push({
        category: "Constraints",
        tip: "Clear constraints defined - guides AI output",
        severity: "success"
      });
    }

    // Check for role clarity
    tips.push({
      category: "Role Definition",
      tip: `Role set to "${config.role}" - helps AI adopt the right perspective`,
      severity: "success"
    });

    // Check for output format
    tips.push({
      category: "Output Format",
      tip: `Format specified as "${config.outputFormat}" - ensures structured response`,
      severity: "success"
    });

    // Additional optimization suggestions
    if (config.taskType === "Code Generation" && !config.constraints.includes("language")) {
      tips.push({
        category: "Enhancement",
        tip: "Specify the programming language in constraints for code tasks",
        severity: "info"
      });
    }

    if (prompt.length < 50) {
      tips.push({
        category: "Length",
        tip: "Longer, more detailed prompts typically produce better results",
        severity: "warning"
      });
    } else {
      tips.push({
        category: "Length",
        tip: "Prompt length is appropriate for detailed responses",
        severity: "success"
      });
    }

    setOptimizationTips(tips);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  const downloadPrompt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "prompt.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Prompt downloaded!");
  };

  const loadSample = () => {
    setUserPrompt("Create a React component that displays a list of users with filtering and sorting capabilities. Include TypeScript types and error handling.");
    setConfig({
      role: "Expert Developer",
      taskType: "Code Generation",
      tone: "Professional",
      context: "Building a modern web application with React 19",
      constraints: "Use TypeScript, Tailwind CSS, and shadcn/ui components",
      outputFormat: "Code Block",
      expertise: "Advanced"
    });
  };

  const clearAll = () => {
    setUserPrompt("");
    setGeneratedPrompt("");
    setOptimizationTips([]);
    setConfig({
      role: "Expert Developer",
      taskType: "Code Generation",
      tone: "Professional",
      context: "",
      constraints: "",
      outputFormat: "Code Block",
      expertise: "Intermediate"
    });
    toast.success("All fields cleared!");
  };

  const successCount = useMemo(() => {
    return optimizationTips.filter(t => t.severity === "success").length;
  }, [optimizationTips]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-500" />
              AI Prompt Generator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Create and optimize prompts for AI models</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Configuration</h2>

              <div className="space-y-4">
                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Role</label>
                  <Select value={config.role} onValueChange={(value) => setConfig({ ...config, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Expertise */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Expertise Level</label>
                  <Select value={config.expertise} onValueChange={(value) => setConfig({ ...config, expertise: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERTISE_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Type */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Task Type</label>
                  <Select value={config.taskType} onValueChange={(value) => setConfig({ ...config, taskType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Tone</label>
                  <Select value={config.tone} onValueChange={(value) => setConfig({ ...config, tone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map(tone => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Output Format */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Output Format</label>
                  <Select value={config.outputFormat} onValueChange={(value) => setConfig({ ...config, outputFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTPUT_FORMATS.map(format => (
                        <SelectItem key={format} value={format}>{format}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Context */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Context (Optional)</label>
                  <Textarea
                    placeholder="Add background information..."
                    value={config.context}
                    onChange={(e) => setConfig({ ...config, context: e.target.value })}
                    className="h-20 resize-none text-sm"
                  />
                </div>

                {/* Constraints */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Constraints (Optional)</label>
                  <Textarea
                    placeholder="Define limitations or requirements..."
                    value={config.constraints}
                    onChange={(e) => setConfig({ ...config, constraints: e.target.value })}
                    className="h-20 resize-none text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={loadSample}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Sample
                  </Button>
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Prompt Input */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Your Prompt</h2>
              <Textarea
                placeholder="Enter your prompt or question here..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="h-32 resize-none text-sm"
              />
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={generatePrompt}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate & Optimize
                </Button>
              </div>
            </Card>

            {/* Generated Prompt & Optimization */}
            {generatedPrompt && (
              <Tabs defaultValue="prompt" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="prompt">Generated Prompt</TabsTrigger>
                  <TabsTrigger value="optimization">
                    Optimization Tips ({successCount}/{optimizationTips.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="space-y-4">
                  <Card className="p-6">
                    <div className="bg-muted p-4 rounded-lg mb-4 font-mono text-sm text-foreground whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                      {generatedPrompt}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadPrompt}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-3">
                  {optimizationTips.map((tip, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start gap-3">
                        {tip.severity === "success" && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        {tip.severity === "warning" && (
                          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        {tip.severity === "info" && (
                          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{tip.category}</span>
                            <Badge variant={
                              tip.severity === "success" ? "default" :
                              tip.severity === "warning" ? "secondary" :
                              "outline"
                            } className="text-xs">
                              {tip.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.tip}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}

            {/* Best Practices Guide */}
            <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 border-cyan-500/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-500" />
                Prompt Engineering Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Be specific and clear about what you want</li>
                <li>✓ Provide relevant context and background</li>
                <li>✓ Define constraints and limitations</li>
                <li>✓ Specify the desired output format</li>
                <li>✓ Use examples when possible</li>
                <li>✓ Assign a role or persona to the AI</li>
                <li>✓ Break complex tasks into smaller steps</li>
                <li>✓ Iterate and refine based on results</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
