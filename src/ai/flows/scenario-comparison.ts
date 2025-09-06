// This is an AI-powered analysis that summarizes the key differences between mortgage scenarios and predicts the best financial fit.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScenarioSchema = z.object({
  name: z.string().describe('The name of the scenario.'),
  loanAmount: z.number().describe('The total amount of the loan.'),
  interestRate: z.number().describe('The annual interest rate as a decimal (e.g., 0.05 for 5%).'),
  loanTerm: z.number().describe('The loan term in years.'),
  monthlyPayment: z.number().describe('The calculated monthly payment for the loan.'),
});

export type Scenario = z.infer<typeof ScenarioSchema>;

const ScenarioComparisonInputSchema = z.array(
  ScenarioSchema
).describe('An array of mortgage scenarios to compare.');

export type ScenarioComparisonInput = z.infer<typeof ScenarioComparisonInputSchema>;

const ScenarioComparisonOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis comparing the scenarios, highlighting key differences, and predicting the best financial fit based on risk tolerance and financial goals.'),
});

export type ScenarioComparisonOutput = z.infer<typeof ScenarioComparisonOutputSchema>;

export async function compareScenarios(input: ScenarioComparisonInput): Promise<ScenarioComparisonOutput> {
  return scenarioComparisonFlow(input);
}

const scenarioComparisonPrompt = ai.definePrompt({
  name: 'scenarioComparisonPrompt',
  input: {schema: ScenarioComparisonInputSchema},
  output: {schema: ScenarioComparisonOutputSchema},
  prompt: `You are a financial advisor specializing in mortgage comparisons.

  Analyze the following mortgage scenarios and provide a comprehensive comparison. Highlight the key differences in loan amounts, interest rates, loan terms, and monthly payments.

  Based on the provided data, predict the best financial fit, considering factors like risk tolerance and long-term financial goals. Offer specific recommendations.

  Scenarios:
  {{#each this}}
  Scenario Name: {{name}}
  Loan Amount: {{loanAmount}}
  Interest Rate: {{interestRate}}
  Loan Term: {{loanTerm}} years
  Monthly Payment: {{monthlyPayment}}
  {{/each}}
  `,
});

const scenarioComparisonFlow = ai.defineFlow(
  {
    name: 'scenarioComparisonFlow',
    inputSchema: ScenarioComparisonInputSchema,
    outputSchema: ScenarioComparisonOutputSchema,
  },
  async input => {
    const {output} = await scenarioComparisonPrompt(input);
    return output!;
  }
);
