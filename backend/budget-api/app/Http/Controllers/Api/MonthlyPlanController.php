<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MonthlyPlan;
use Illuminate\Http\Request;

class MonthlyPlanController extends Controller
{
    public function show(Request $request)
    {
        $year = (int) $request->query('year');
        $month = (int) $request->query('month');

        if (!$year || !$month) {
            return response()->json(['message' => 'year and month are required'], 422);
        }

        $plan = MonthlyPlan::query()
            ->where('year', $year)
            ->where('month', $month)
            ->first();

        if (!$plan) {
            // return default (no record yet)
            return response()->json([
                'year' => $year,
                'month' => $month,
                'expected_income' => 0.0,
            ]);
        }

        return response()->json([
            'year' => $plan->year,
            'month' => $plan->month,
            'expected_income' => (float) $plan->expected_income,
        ]);
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'expected_income' => ['required', 'numeric', 'min:0'],
        ]);

        $plan = MonthlyPlan::updateOrCreate(
            ['year' => $data['year'], 'month' => $data['month']],
            ['expected_income' => $data['expected_income']]
        );

        return response()->json([
            'year' => $plan->year,
            'month' => $plan->month,
            'expected_income' => (float) $plan->expected_income,
        ]);
    }
}
