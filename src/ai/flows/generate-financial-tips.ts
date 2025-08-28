import { defineFlow } from 'genkit';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { runFlow } from 'genkit';

const expenseSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
});

const expensesInputSchema = z.array(expenseSchema);

const tipsOutputSchema = z.object({
  tips: z.string(),
});

export const generateFinancialTipsFlow = defineFlow(
  {
    name: 'generateFinancialTipsFlow',
    inputSchema: expensesInputSchema,
    outputSchema: tipsOutputSchema,
  },
  async (expenses) => {
    if (expenses.length === 0) {
      return { tips: 'No expenses to analyze. Add some expenses to get financial tips.' };
    }

    const prompt = `You are a friendly financial advisor. Based on the following list of expenses, provide a few actionable and personalized financial tips to help the user save money. Keep the tone encouraging and positive. Format the response as a single string, with each tip on a new line.

Expenses:
${JSON.stringify(expenses, null, 2)}

Your tips:`;

    const llmResponse = await geminiPro.generate({
      prompt: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const tips = llmResponse.text();

    return { tips };
  }
);
