import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import JsonValidator from "./pages/JsonValidator";
import Base64Converter from "./pages/Base64Converter";
import CaseConverter from "./pages/CaseConverter";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import GrammarChecker from "./pages/GrammarChecker";
import TextFormatter from "./pages/TextFormatter";
import MarkdownConverter from "./pages/MarkdownConverter";
import WordCounter from "./pages/WordCounter";
import MatrixCalculator from "./pages/MatrixCalculator";
import PrimeFactors from "./pages/PrimeFactors";
import PercentageCalculator from "./pages/PercentageCalculator";
import TipCalculator from "./pages/TipCalculator";
import ImageToBase64 from "./pages/ImageToBase64";
import ImageConverter from "./pages/ImageConverter";
import ColorExtractor from "./pages/ColorExtractor";

/* Design System: Modern Minimalist with Neon Accents
   - Light theme with off-white background (#F8F8F8)
   - Cyan (#00D9FF) primary accent
   - Magenta (#FF006E) secondary accent
   - Lime (#39FF14) success accent
   - Typography: Space Mono for headings, Inter for body
*/

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tool/json-validator"} component={JsonValidator} />
      <Route path={"/tool/base64"} component={Base64Converter} />
      <Route path={"/tool/case-converter"} component={CaseConverter} />
      <Route path={"/tool/qr-code"} component={QRCodeGenerator} />
      <Route path={"/tool/grammar-checker"} component={GrammarChecker} />
      <Route path={"/tool/text-formatter"} component={TextFormatter} />
      <Route path={"/tool/markdown-converter"} component={MarkdownConverter} />
      <Route path={"/tool/word-counter"} component={WordCounter} />
      <Route path={"/tool/matrix-calculator"} component={MatrixCalculator} />
      <Route path={"/tool/prime-factors"} component={PrimeFactors} />
      <Route path={"/tool/percentage-calculator"} component={PercentageCalculator} />
      <Route path={"/tool/tip-calculator"} component={TipCalculator} />
      <Route path={"/tool/image-to-base64"} component={ImageToBase64} />
      <Route path={"/tool/image-converter"} component={ImageConverter} />
      <Route path={"/tool/color-extractor"} component={ColorExtractor} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
