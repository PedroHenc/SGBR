"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Category, TransactionType } from '@/lib/types';
import { suggestTransactionCategories } from '@/ai/flows/suggest-transaction-categories';

interface AddTransactionDialogProps {
  type: TransactionType;
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export function AddTransactionDialog({ type, categories, onAddTransaction }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: "",
    },
  });

  async function handleDescriptionChange(description: string) {
    if (description.length > 3) {
      setIsLoadingSuggestions(true);
      try {
        const result = await suggestTransactionCategories({
          transactionDescription: description,
          availableCategories: categories.map(c => c.name),
        });
        setSuggestions(result.suggestedCategories);
      } catch (error) {
        console.error("AI suggestion error:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not fetch category suggestions.",
        });
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTransaction({ ...values, type });
    toast({
      title: `${type === 'revenue' ? 'Revenue' : 'Expense'} Added`,
      description: `Added "${values.description}" for $${values.amount}.`,
    });
    setOpen(false);
    form.reset();
    setSuggestions([]);
  }
  
  const title = type === 'revenue' ? 'Add Revenue' : 'Add Expense';
  const description = `Enter the details for your new ${type}.`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setSuggestions([]);
        }
    }}>
      <DialogTrigger asChild>
        <Button variant={type === 'revenue' ? 'default' : 'secondary'}>
          <Plus className="mr-2 h-4 w-4" /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monthly server cost" {...field} onChange={(e) => {
                      field.onChange(e);
                      handleDescriptionChange(e.target.value);
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isLoadingSuggestions || suggestions.length > 0) && (
              <div className="space-y-2">
                <FormLabel>AI Suggestions</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {isLoadingSuggestions ? (
                    <Badge variant="outline"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Thinking...</Badge>
                  ) : (
                    suggestions.map(suggestion => {
                      const category = categories.find(c => c.name === suggestion);
                      return category ? (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => form.setValue('categoryId', category.id, { shouldValidate: true })}
                        >
                          {suggestion}
                        </Badge>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add {type}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
