'use server';

/**
 * @fileOverview An AI agent that generates a concise, human-readable summary of a laptop's specifications and key features.
 *
 * - generateSpecSummary - A function that generates the specification summary.
 * - GenerateSpecSummaryInput - The input type for the generateSpecSummary function.
 * - GenerateSpecSummaryOutput - The return type for the generateSpecSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpecSummaryInputSchema = z.object({
  specs: z
    .string()
    .describe('The specifications of the laptop, including brand, RAM, processor, price, and condition.'),
});
export type GenerateSpecSummaryInput = z.infer<typeof GenerateSpecSummaryInputSchema>;

const GenerateSpecSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, human-readable summary of the laptop specifications.'),
});
export type GenerateSpecSummaryOutput = z.infer<typeof GenerateSpecSummaryOutputSchema>;

export async function generateSpecSummary(input: GenerateSpecSummaryInput): Promise<GenerateSpecSummaryOutput> {
  return generateSpecSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpecSummaryPrompt',
  input: {schema: GenerateSpecSummaryInputSchema},
  output: {schema: GenerateSpecSummaryOutputSchema},
  prompt: `You are an AI expert in creating concise, human-readable summaries of laptop specifications.

  Please create a summary of the specifications provided, highlighting the key features and benefits for a potential buyer.

  Specifications: {{{specs}}}`,
});

const generateSpecSummaryFlow = ai.defineFlow(
  {
    name: 'generateSpecSummaryFlow',
    inputSchema: GenerateSpecSummaryInputSchema,
    outputSchema: GenerateSpecSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
