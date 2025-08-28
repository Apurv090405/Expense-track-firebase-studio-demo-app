'use server';

import { runAction } from '@genkit-ai/next/action';
import { generateFinancialTipsFlow } from '@/ai/flows/generate-financial-tips';

export const getFinancialTips = runAction(generateFinancialTipsFlow);
