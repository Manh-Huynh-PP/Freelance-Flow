import { useMemo, useCallback } from 'react';
import type { Quote, QuoteColumn, QuoteItem, ColumnCalculationType } from '@/lib/types';
import { safeEval } from '@/lib/helpers/formula-parser';

export interface CalculationResult {
  id: string;
  name: string;
  calculation: string;
  result: number | string;
  type: ColumnCalculationType;
}

/**
 * Pure function: calculate a single row's value for a given column,
 * supporting row-level formulas that reference other numeric columns.
 */
export function calculateRowValue(
  item: QuoteItem,
  column: QuoteColumn,
  allColumns: QuoteColumn[]
): number {
  if (column.rowFormula) {
    try {
      const rowVals: Record<string, number> = {};
      allColumns.forEach(c => {
        if (c.type === 'number' && c.id !== column.id) {
          const val = c.id === 'unitPrice'
            ? Number(item.unitPrice) || 0
            : Number(item.customFields?.[c.id]) || 0;
          rowVals[c.id] = val;
        }
      });

      let expr = column.rowFormula;
      Object.entries(rowVals).forEach(([cid, val]) => {
        expr = expr.replaceAll(cid, val.toString());
      });

      const result = safeEval(expr);
      return !isNaN(result) ? Number(result) : 0;
    } catch {
      return 0;
    }
  } else {
    if (column.id === 'unitPrice') {
      return Number(item.unitPrice) || 0;
    } else {
      return Number(item.customFields?.[column.id]) || 0;
    }
  }
}

/**
 * Compute column-level aggregation (sum/avg/min/max/custom) across all sections.
 */
function computeColumnAggregations(
  sections: Quote['sections'] | undefined,
  columns: QuoteColumn[],
  defaultColumns: QuoteColumn[]
): CalculationResult[] {
  if (!sections) return [];

  const results: CalculationResult[] = [];
  const cols = columns || defaultColumns;

  cols.filter(col =>
    col.calculation && col.calculation.type && col.calculation.type !== 'none' && col.type === 'number'
  ).forEach(col => {
    if (!col.calculation) return;

    const allValues = sections.flatMap((section) =>
      (section.items || []).map((item) => calculateRowValue(item, col, cols))
        .filter((v: number) => !isNaN(v))
    );

    let result: number | string = 0;
    let calculation = '';
    const calcType = col.calculation.type;

    switch (calcType) {
      case 'sum':
        result = allValues.reduce((acc, val) => acc + val, 0);
        calculation = 'Sum';
        break;
      case 'average':
        result = allValues.length ? allValues.reduce((acc, val) => acc + val, 0) / allValues.length : 0;
        calculation = 'Average';
        break;
      case 'min':
        result = allValues.length ? Math.min(...allValues) : 0;
        calculation = 'Min';
        break;
      case 'max':
        result = allValues.length ? Math.max(...allValues) : 0;
        calculation = 'Max';
        break;
      case 'custom':
        try {
          if (col.calculation.formula) {
            const formula = col.calculation.formula.replace(/values/g, JSON.stringify(allValues));
            result = safeEval(formula) || 0;
          } else {
            result = 0;
          }
        } catch {
          result = 0;
        }
        calculation = 'Custom';
        break;
      default:
        return;
    }

    results.push({ id: col.id, name: col.name, calculation, result, type: calcType });
  });

  return results;
}

/**
 * Custom hook that encapsulates all quote calculation logic:
 *  - Per-row formula evaluation
 *  - Column aggregations (sum, avg, etc.)
 *  - Grand total with formula support
 *  - Collaborator quote aggregations
 */
export function useQuoteCalculations(
  localQuote: Quote | undefined,
  defaultColumns: QuoteColumn[],
  taskCollaboratorQuotes: { quote: Quote; collaboratorId: string }[]
) {
  // Stable callback wrapper for calculateRowValue (pure, no deps)
  const calcRowValue = useCallback(
    (item: QuoteItem, column: QuoteColumn, allColumns: QuoteColumn[]) =>
      calculateRowValue(item, column, allColumns),
    []
  );

  // Total for main quote
  const totalQuote = useMemo(() => {
    if (!localQuote?.sections) return 0;
    const priceColumn = (localQuote.columns || defaultColumns).find(col => col.id === 'unitPrice');
    if (!priceColumn) return 0;
    return localQuote.sections.reduce((acc, section) => {
      return acc + (section.items?.reduce((itemAcc, item) => {
        return itemAcc + calculateRowValue(item, priceColumn, localQuote.columns || defaultColumns);
      }, 0) || 0);
    }, 0);
  }, [localQuote, defaultColumns]);

  // Total for all collaborator quotes
  const totalCollabQuote = useMemo(() => {
    if (!taskCollaboratorQuotes || taskCollaboratorQuotes.length === 0) return 0;

    return taskCollaboratorQuotes.reduce((totalAcc, { quote: collabQuote }) => {
      if (!collabQuote?.sections) return totalAcc;

      const unitPriceCol = (collabQuote.columns || defaultColumns).find(c => c.id === 'unitPrice');
      if (!unitPriceCol) return totalAcc;

      const quoteTotal = collabQuote.sections.reduce((sectionAcc, section) => {
        return sectionAcc + (section.items?.reduce((itemAcc, item) => {
          return itemAcc + calculateRowValue(item, unitPriceCol, (collabQuote.columns || defaultColumns));
        }, 0) || 0);
      }, 0);

      return totalAcc + quoteTotal;
    }, 0);
  }, [taskCollaboratorQuotes, defaultColumns]);

  // Column-level aggregations for main quote
  const calculationResults = useMemo(() =>
    computeColumnAggregations(localQuote?.sections, localQuote?.columns || defaultColumns, defaultColumns),
    [localQuote, defaultColumns]
  );

  // Grand total applying saved formula (if any)
  const displayedGrandTotal = useMemo(() => {
    const formulaSrc = (localQuote as any)?.grandTotalFormula as string | undefined;
    if (formulaSrc && typeof formulaSrc === 'string' && formulaSrc.trim() !== '') {
      try {
        let formula = formulaSrc;
        formula = formula.replace(/(\})\s*(\{)/g, '}+{');
        formula = formula
          .replace(/\{Price\}/g, totalQuote.toString())
          .replace(/\{Collab\}/g, totalCollabQuote.toString())
          .replace(/\{P\}/g, totalQuote.toString())
          .replace(/\{C\}/g, totalCollabQuote.toString())
          .replace(/\{\s*priceSum\s*\}/g, totalQuote.toString())
          .replace(/\{\s*collabSum\s*\}/g, totalCollabQuote.toString());

        calculationResults.forEach((calc, index) => {
          const value = typeof calc.result === 'number' ? calc.result : 0;
          const varName = calc.name.replace(/\s+/g, '');
          formula = formula.replaceAll(`{${varName}}`, value.toString());
          formula = formula.replaceAll(`{${String.fromCharCode(65 + index)}}`, value.toString());
          formula = formula.replaceAll(`{${calc.id}}`, value.toString());
        });

        const result = safeEval(formula);
        if (typeof result === 'number' && !isNaN(result)) return result;
        return totalQuote;
      } catch {
        return totalQuote;
      }
    }
    return totalQuote;
  }, [localQuote, totalQuote, totalCollabQuote, calculationResults]);

  // Collaborator aggregations (merged across all collab quotes)
  const collaboratorCalculationResults = useMemo(() => {
    if (!taskCollaboratorQuotes || taskCollaboratorQuotes.length === 0) return [];

    const results: CalculationResult[] = [];

    taskCollaboratorQuotes.forEach(({ quote: collabQuote }) => {
      if (!collabQuote?.sections) return;

      const perQuote = computeColumnAggregations(
        collabQuote.sections,
        collabQuote.columns || defaultColumns,
        defaultColumns
      );

      perQuote.forEach(calc => {
        const existingIndex = results.findIndex(r => r.id === calc.id);
        if (existingIndex === -1) {
          results.push({ ...calc });
        } else {
          const existing = results[existingIndex];
          if (typeof existing.result === 'number' && typeof calc.result === 'number') {
            let merged: number;
            switch (calc.type) {
              case 'sum':
                merged = existing.result + calc.result;
                break;
              case 'min':
                merged = Math.min(existing.result, calc.result);
                break;
              case 'max':
                merged = Math.max(existing.result, calc.result);
                break;
              case 'average':
                merged = (existing.result + calc.result) / 2;
                break;
              default:
                merged = existing.result;
            }
            results[existingIndex] = { ...existing, result: merged };
          }
        }
      });
    });

    return results;
  }, [taskCollaboratorQuotes, defaultColumns]);

  return {
    calculateRowValue: calcRowValue,
    totalQuote,
    totalCollabQuote,
    calculationResults,
    displayedGrandTotal,
    collaboratorCalculationResults,
  };
}
