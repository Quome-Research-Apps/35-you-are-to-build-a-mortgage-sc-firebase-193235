"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, BarChartHorizontal } from "lucide-react";
import { type Scenario } from "@/types";

interface ScenarioListProps {
  scenarios: Scenario[];
  onDelete: (id: string) => void;
  onCompare: (selected: Scenario[]) => void;
}

export function ScenarioList({ scenarios, onDelete, onCompare }: ScenarioListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(scenarios.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleCompareClick = () => {
    const selected = scenarios.filter((s) => selectedIds.has(s.id));
    onCompare(selected);
  };

  if (scenarios.length === 0) {
    return <p className="text-center text-muted-foreground py-8">You have no saved scenarios yet. Use the calculator to add one!</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.size === scenarios.length && scenarios.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Loan Amount</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Term</TableHead>
              <TableHead className="text-right">Monthly Payment</TableHead>
              <TableHead className="w-[50px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((s) => (
              <TableRow key={s.id} data-state={selectedIds.has(s.id) ? 'selected' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(s.id)}
                    onCheckedChange={(checked) => handleSelect(s.id, Boolean(checked))}
                    aria-label={`Select ${s.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-right">{s.loanAmount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                <TableCell className="text-right">{s.interestRate.toFixed(2)}%</TableCell>
                <TableCell className="text-right">{s.loanTerm} yrs</TableCell>
                <TableCell className="text-right font-semibold text-primary">{s.monthlyPayment.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onDelete(s.id)} aria-label={`Delete ${s.name}`}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleCompareClick} disabled={selectedIds.size < 2}>
          <BarChartHorizontal className="mr-2 h-4 w-4" /> Compare Selected ({selectedIds.size})
        </Button>
      </div>
    </div>
  );
}
