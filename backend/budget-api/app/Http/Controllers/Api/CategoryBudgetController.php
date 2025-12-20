<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CategoryBudget;

class CategoryBudgetController extends Controller
{
    public function index(Request $request)
    {
        $year = (int) $request->query('year');
        $month = (int) $request->query('month');

        $budgets = CategoryBudget::query()
            ->when($year, fn($q) => $q->where('year', $year))
            ->when($month, fn($q) => $q->where('month', $month))
            ->orderBy('category')
            ->get(['year', 'month', 'category', 'amount']);

        $result = $budgets->map(fn($b) => [
            'year' => $b->year,
            'month' => $b->month,
            'category' => $b->category,
            'amount' => (float) $b->amount,
        ]);

        return response()->json($result);
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'category' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $budget = CategoryBudget::updateOrCreate(
            [
                'year' => $data['year'],
                'month' => $data['month'],
                'category' => $data['category']
            ],
            ['amount' => $data['amount']]
        );

        return response()->json([
            'year' => $budget->year,
            'month' => $budget->month,
            'category' => $budget->category,
            'amount' => (float) $budget->amount,
        ]);
    }
}
