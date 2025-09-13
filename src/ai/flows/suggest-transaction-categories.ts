"use server";

/**
 * @fileOverview An AI agent for suggesting transaction categories.
 *
 * - suggestTransactionCategories - A function that suggests relevant categories for a given transaction description.
 * - SuggestTransactionCategoriesInput - The input type for the suggestTransactionCategories function.
 * - SuggestTransactionCategoriesOutput - The return type for the suggestTransactionCategories function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SuggestTransactionCategoriesInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe("The description of the transaction to categorize."),
  availableCategories: z
    .array(z.string())
    .describe("A list of available categories to choose from."),
});
export type SuggestTransactionCategoriesInput = z.infer<
  typeof SuggestTransactionCategoriesInputSchema
>;

const SuggestTransactionCategoriesOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe(
      "A list of suggested categories that are relevant to the transaction description.",
    ),
});
export type SuggestTransactionCategoriesOutput = z.infer<
  typeof SuggestTransactionCategoriesOutputSchema
>;

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput,
): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestTransactionCategoriesPrompt",
  input: { schema: SuggestTransactionCategoriesInputSchema },
  output: { schema: SuggestTransactionCategoriesOutputSchema },
  prompt:
    `You are an expert financial advisor that helps users categorize their transactions.

  Given the following transaction description:
  {{transactionDescription}}

  And the following available categories:
  {{#each availableCategories}}
  - {{{this}}}
  {{/each}}

  Suggest the most relevant categories for this transaction. Limit your response to a maximum of 3 categories.
  Ensure that the categories you choose are from the list of available categories.

  Format your response as a JSON array of strings.`,
});

const suggestTransactionCategoriesFlow = ai.defineFlow(
  {
    name: "suggestTransactionCategoriesFlow",
    inputSchema: SuggestTransactionCategoriesInputSchema,
    outputSchema: SuggestTransactionCategoriesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
