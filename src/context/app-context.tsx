
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Expense, Budget, Investment, Goal } from '@/lib/types';

interface AppContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  investments: Investment[];
  addInvestment: (investment: Investment) => void;
  updateInvestmentPrice: (id: string, newPrice: number) => void;
  deleteInvestment: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialExpenses: Expense[] = [
  { id: '1', description: 'Groceries', amount: 75.5, category: 'Food', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '2', description: 'Gasoline', amount: 40.0, category: 'Transport', date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '3', description: 'Movie Tickets', amount: 30.0, category: 'Entertainment', date: new Date(Date.now() - 86400000 * 4).toISOString() },
];

const initialBudgets: Budget[] = [
  { id: '1', category: 'Food', amount: 500 },
  { id: '2', category: 'Entertainment', amount: 150 },
];

const initialInvestments: Investment[] = [
    { id: '1', name: 'Apple Inc.', type: 'Stock', quantity: 10, purchasePrice: 150, currentPrice: 175 },
    { id: '2', name: 'Bitcoin', type: 'Crypto', quantity: 0.5, purchasePrice: 40000, currentPrice: 65000 },
];

const initialGoals: Goal[] = [
    { id: '1', name: 'Vacation to Hawaii', targetAmount: 5000, currentAmount: 1200, targetDate: new Date('2025-06-01').toISOString() },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('spendwise_expenses');
      const storedBudgets = localStorage.getItem('spendwise_budgets');
      const storedInvestments = localStorage.getItem('spendwise_investments');
      const storedGoals = localStorage.getItem('spendwise_goals');

      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : initialExpenses);
      setBudgets(storedBudgets ? JSON.parse(storedBudgets) : initialBudgets);
      setInvestments(storedInvestments ? JSON.parse(storedInvestments) : initialInvestments);
      setGoals(storedGoals ? JSON.parse(storedGoals) : initialGoals);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setExpenses(initialExpenses);
      setBudgets(initialBudgets);
      setInvestments(initialInvestments);
      setGoals(initialGoals);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded){
      try {
        localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
        localStorage.setItem('spendwise_budgets', JSON.stringify(budgets));
        localStorage.setItem('spendwise_investments', JSON.stringify(investments));
        localStorage.setItem('spendwise_goals', JSON.stringify(goals));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [expenses, budgets, investments, goals, isLoaded]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const addBudget = (budget: Budget) => {
    setBudgets((prev) => {
      const existingIndex = prev.findIndex((b) => b.category === budget.category);
      if (existingIndex > -1) {
        const updatedBudgets = [...prev];
        updatedBudgets[existingIndex] = budget;
        return updatedBudgets;
      }
      return [budget, ...prev];
    });
  };

  const addInvestment = (investment: Investment) => {
    setInvestments((prev) => [investment, ...prev]);
  };

  const updateInvestmentPrice = (id: string, newPrice: number) => {
    setInvestments((prev) => prev.map(inv => inv.id === id ? {...inv, currentPrice: newPrice} : inv));
  };
  
  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  }

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  const value = {
    expenses,
    addExpense,
    budgets,
    addBudget,
    investments,
    addInvestment,
    updateInvestmentPrice,
    deleteInvestment,
    goals,
    addGoal,
    deleteGoal
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
