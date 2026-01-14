"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import type { AppSettings } from '@/lib/types';
import { i18n } from '@/lib/i18n';
import { safeEval } from '@/lib/helpers/formula-parser';

const evaluateExpression = (expr: string): number => {
  // Pre-process expression:
  // 1. Replace 'x' or 'X' with '*'
  // 2. Handle implicit multiplication: 2(3) -> 2*(3), )2 -> )*2
  // Note: safeEval handles comma removal and ^ operator natively
  let sanitizedExpr = expr
    .replace(/[xX]/g, '*')
    .replace(/\*\*/g, '^') // Support JS style power operator by converting to ^
    .replace(/(\d)\s*\(/g, '$1*(')
    .replace(/\)\s*(\d)/g, ')*$1');

  const result = safeEval(sanitizedExpr);

  if (isNaN(result)) {
    throw new Error("Invalid mathematical expression.");
  }

  return result;
};

type CalculatorProps = {
  settings: AppSettings;
}

export function Calculator({ settings }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const T = i18n[settings.language];

  const handleCalculate = () => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }
    try {
      const calculationResult = evaluateExpression(expression);
      if (typeof calculationResult !== 'number' || !isFinite(calculationResult)) {
        setResult('Invalid result.');
      } else {
        const resultString = calculationResult.toLocaleString();
        setResult(resultString);
        // Allow continuous calculation by setting the expression to the result
        setExpression(calculationResult.toString());
      }
    } catch (error: any) {
      setResult(error.message || 'Error calculating.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  }

  const handleClear = () => {
    setExpression('');
    setResult(null);
  }

  const handleCopy = () => {
    if (result && !isNaN(parseFloat(result.replace(/,/g, '')))) {
      navigator.clipboard.writeText(result.replace(/,/g, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle
            className="text-sm font-medium cursor-pointer hover:text-muted-foreground transition-colors"
            onClick={handleClear}
            title="Clear calculation"
          >
            {T.simpleCalculator}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 react-grid-draggable-cancel">
          <div>
            <Label htmlFor="expression-input" className="text-xs text-muted-foreground">{T.expression}</Label>
            <Input
              id="expression-input"
              placeholder="e.g., 2 * (10 + 5)"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{T.result}</Label>
            <div className="relative mt-1">
              <div className="bg-muted text-foreground text-right text-xl font-mono p-2.5 rounded-md overflow-x-auto break-all min-h-[44px] flex items-center justify-end pr-9">
                {result ?? '0'}
              </div>
              {result && !isNaN(parseFloat(result.replace(/,/g, ''))) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                  title="Copy result"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}