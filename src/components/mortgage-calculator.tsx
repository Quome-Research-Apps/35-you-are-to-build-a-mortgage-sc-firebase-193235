"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Calendar, Save } from "lucide-react";
import type { Scenario } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Scenario name is required."),
  loanAmount: z.coerce.number().min(1, "Loan amount must be greater than 0."),
  interestRate: z.coerce.number().min(0.01, "Interest rate must be positive.").max(100),
  loanTerm: z.coerce.number().int().min(1, "Loan term must be at least 1 year.").max(50),
});

type CalculatorFormValues = z.infer<typeof formSchema>;

interface MortgageCalculatorProps {
  onSaveScenario: (scenario: Omit<Scenario, "id">) => void;
}

const calculateMonthlyPayment = (
  loanAmount: number,
  annualRate: number,
  termYears: number
): { monthlyPayment: number; totalInterest: number; totalCost: number } => {
  if (!loanAmount || !annualRate || !termYears || loanAmount <= 0 || annualRate <= 0 || termYears <= 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = loanAmount / numberOfPayments;
    return { monthlyPayment, totalInterest: 0, totalCost: loanAmount };
  }
  
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const totalCost = monthlyPayment * numberOfPayments;
  const totalInterest = totalCost - loanAmount;

  return { monthlyPayment, totalInterest, totalCost };
};

export function MortgageCalculator({ onSaveScenario }: MortgageCalculatorProps) {
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      loanAmount: 300000,
      interestRate: 5.5,
      loanTerm: 30,
    },
  });

  const watchedValues = form.watch();

  const { monthlyPayment, totalInterest, totalCost } = useMemo(() => 
    calculateMonthlyPayment(watchedValues.loanAmount, watchedValues.interestRate, watchedValues.loanTerm)
  , [watchedValues.loanAmount, watchedValues.interestRate, watchedValues.loanTerm]);

  const onSubmit = (data: CalculatorFormValues) => {
    onSaveScenario({
      name: data.name,
      loanAmount: data.loanAmount,
      interestRate: data.interestRate,
      loanTerm: data.loanTerm,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalCost: totalCost,
    });
    form.reset({ ...data, name: "" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="300,000" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" step="0.01" placeholder="5.5" className="pr-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Term (Years)</FormLabel>
                   <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" placeholder="30" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 30-Year Fixed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            <Save className="mr-2 h-4 w-4" /> Save Scenario
          </Button>
        </form>
      </Form>
      
      <Card className="md:col-span-1 bg-secondary/50 flex flex-col justify-center">
        <CardHeader>
            <CardTitle className="text-center text-muted-foreground text-lg font-medium">Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-4xl font-bold text-primary">
                {monthlyPayment.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                })}
            </p>
        </CardContent>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground p-4">
             <div className="w-full flex justify-between">
                <span>Total Interest:</span>
                <span className="font-medium">{totalInterest.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            </div>
            <div className="w-full flex justify-between">
                <span>Total Cost:</span>
                <span className="font-medium">{totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
