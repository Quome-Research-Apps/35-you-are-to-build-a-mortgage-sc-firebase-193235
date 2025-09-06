"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Scenario } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { ScenarioList } from "@/components/scenario-list";
import { InterestChart } from "@/components/interest-chart";
import { ScenarioComparisonDialog } from "@/components/scenario-comparison-dialog";
import { useToast } from "@/hooks/use-toast";
import { AreaChart } from "lucide-react";

export default function Home() {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>("mortgageScenarios", []);
  const [selectedScenarios, setSelectedScenarios] = useState<Scenario[]>([]);
  const [isComparisonOpen, setComparisonOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveScenario = (scenario: Omit<Scenario, "id">) => {
    const newScenario = { ...scenario, id: new Date().toISOString() };
    setScenarios([...scenarios, newScenario]);
    toast({
      title: "Scenario Saved",
      description: `"${newScenario.name}" has been added to your list.`,
    });
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
    toast({
      title: "Scenario Deleted",
      description: "The scenario has been removed from your list.",
    });
  };

  const handleCompare = (selected: Scenario[]) => {
    if (selected.length < 2) {
      toast({
        title: "Select More Scenarios",
        description: "Please select at least two scenarios to compare.",
        variant: "destructive",
      });
      return;
    }
    setSelectedScenarios(selected);
    setComparisonOpen(true);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">
            MortgageMind
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your personal mortgage scenario planner.
          </p>
        </header>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="scenarios">Saved Scenarios</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <MortgageCalculator onSaveScenario={handleSaveScenario} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scenarios">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScenarioList
                    scenarios={scenarios}
                    onDelete={handleDeleteScenario}
                    onCompare={handleCompare}
                  />
                </CardContent>
              </Card>

              {scenarios.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><AreaChart className="h-6 w-6" /> Total Interest Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InterestChart scenarios={scenarios} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ScenarioComparisonDialog
        isOpen={isComparisonOpen}
        onOpenChange={setComparisonOpen}
        scenarios={selectedScenarios}
      />
    </main>
  );
}
