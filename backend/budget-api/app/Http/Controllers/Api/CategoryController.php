<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoryBudget;
use App\Models\FixedMonthlyItem;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function merge(Request $request)
    {
        $data = $request->validate([
            'from' => ['required', 'string', 'max:255'],
            'to' => ['required', 'string', 'max:255'],
        ]);

        $fromRaw = trim($data['from']);
        $toRaw = trim($data['to']);
        $fromNormalized = $this->normalizeCategory($fromRaw);
        $toNormalized = $this->normalizeCategory($toRaw);

        if ($fromNormalized === $toNormalized) {
            return response()->json([
                'message' => 'Cannot merge category into itself'
            ], 422);
        }

        $fromLower = strtolower($fromRaw);

        return DB::transaction(function () use ($fromLower, $fromNormalized, $toNormalized) {
            $updatedTransactions = $this->updateTransactions($fromLower, $fromNormalized, $toNormalized);
            $budgetStats = $this->mergeBudgets($fromLower, $fromNormalized, $toNormalized);
            $updatedFixedItems = $this->updateFixedItems($fromLower, $fromNormalized, $toNormalized);

            return response()->json([
                'from' => $fromNormalized,
                'to' => $toNormalized,
                'updatedTransactions' => $updatedTransactions,
                'updatedBudgets' => $budgetStats['updatedBudgets'],
                'mergedBudgets' => $budgetStats['mergedBudgets'],
                'updatedFixedItems' => $updatedFixedItems,
            ]);
        });
    }

    private function updateTransactions(string $fromLower, string $fromNormalized, string $toNormalized): int
    {
        return Transaction::query()
            ->where(function ($query) use ($fromLower, $fromNormalized) {
                $query->whereRaw('LOWER(TRIM(category)) = ?', [$fromLower]);
                if ($fromNormalized === 'Other') {
                    $query->orWhereNull('category')->orWhere('category', '');
                }
            })
            ->update(['category' => $toNormalized]);
    }

    private function updateFixedItems(string $fromLower, string $fromNormalized, string $toNormalized): int
    {
        return FixedMonthlyItem::query()
            ->where(function ($query) use ($fromLower, $fromNormalized) {
                $query->whereRaw('LOWER(TRIM(category)) = ?', [$fromLower]);
                if ($fromNormalized === 'Other') {
                    $query->orWhereNull('category')->orWhere('category', '');
                }
            })
            ->update(['category' => $toNormalized]);
    }

    private function mergeBudgets(string $fromLower, string $fromNormalized, string $toNormalized): array
    {
        $updatedBudgets = 0;
        $mergedBudgets = 0;

        $budgets = CategoryBudget::query()
            ->where(function ($query) use ($fromLower, $fromNormalized) {
                $query->whereRaw('LOWER(TRIM(category)) = ?', [$fromLower]);
                if ($fromNormalized === 'Other') {
                    $query->orWhereNull('category')->orWhere('category', '');
                }
            })
            ->get();

        foreach ($budgets as $budget) {
            $target = CategoryBudget::query()
                ->where('year', $budget->year)
                ->where('month', $budget->month)
                ->where('category', $toNormalized)
                ->first();

            if ($target && $target->id !== $budget->id) {
                $target->amount = $target->amount + $budget->amount;
                $target->save();
                $budget->delete();
                $mergedBudgets++;
                continue;
            }

            $budget->category = $toNormalized;
            $budget->save();
            $updatedBudgets++;
        }

        return [
            'updatedBudgets' => $updatedBudgets,
            'mergedBudgets' => $mergedBudgets,
        ];
    }

    private function normalizeCategory(string $raw): string
    {
        $s = trim($raw);
        if ($s === '') {
            return 'Other';
        }
        $lower = strtolower($s);
        return ucfirst($lower);
    }
}
