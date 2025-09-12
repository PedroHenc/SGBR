
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Collaborator, Transaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TeamCardProps {
  collaborators: Collaborator[];
  transactions: Transaction[];
}

export function TeamCard({ collaborators, transactions }: TeamCardProps) {

  const getReportCount = (collaboratorId: string) => {
    return transactions.filter(t => t.collaboratorId === collaboratorId).length;
  }

  const topCollaborators = useMemo(() => {
    return collaborators
      .map(c => ({
        ...c,
        reportCount: getReportCount(c.id),
      }))
      .sort((a, b) => b.reportCount - a.reportCount)
      .slice(0, 5);
  }, [collaborators, transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Equipe</CardTitle>
          <CardDescription>
            Os 5 colaboradores mais ativos.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/collaborators">
            Ver Todos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {topCollaborators.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} data-ai-hint="person face" />
                <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {collaborator.name}
                </p>
                <p className="text-sm text-muted-foreground">{collaborator.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{collaborator.reportCount}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
