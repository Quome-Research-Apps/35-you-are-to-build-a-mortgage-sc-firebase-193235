"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { compareScenarios, type ScenarioComparisonInput, type ScenarioComparisonOutput } from "@/ai/flows/scenario-comparison";
import type { Scenario } from "@/types";

interface ScenarioComparisonDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scenarios: Scenario[];
}

export function ScenarioComparisonDialog({ isOpen, onOpenChange, scenarios }: ScenarioComparisonDialogProps) {
  const [analysis, setAnalysis] = useState<ScenarioComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scenarios.length > 1) {
      const runComparison = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
          const input: ScenarioComparisonInput = scenarios.map(s => ({
            name: s.name,
            loanAmount: s.loanAmount,
            interestRate: s.interestRate / 100,
            loanTerm: s.loanTerm,
            monthlyPayment: s.monthlyPayment,
          }));

          const result = await compareScenarios(input);
          setAnalysis(result);
        } catch (e) {
          console.error("AI Comparison Failed:", e);
          setError("Failed to generate comparison. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      runComparison();
    }
  }, [isOpen, scenarios]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Scenario Comparison Analysis</DialogTitle>
          <DialogDescription>
            An AI-powered analysis of your selected mortgage scenarios.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-4">
            {isLoading && (
              <div className="space-y-2 p-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <br />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {analysis && (
              <div className="text-foreground whitespace-pre-wrap font-body leading-relaxed text-sm">
                {analysis.analysis}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
