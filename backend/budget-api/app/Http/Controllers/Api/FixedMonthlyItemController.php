<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FixedMonthlyItem;
use Illuminate\Http\Request;

class FixedMonthlyItemController extends Controller
{
    public function index()
    {
        $items = FixedMonthlyItem::all();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', 'in:income,expense'],
        ]);

        // Auto-set user_id to current authenticated user
        $data['user_id'] = auth()->id();

        $item = FixedMonthlyItem::create($data);

        return response()->json($item, 201);
    }

    public function update(Request $request, FixedMonthlyItem $fixedMonthlyItem)
    {
        $data = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'type' => ['required', 'in:income,expense'],
        ]);

        $fixedMonthlyItem->update($data);

        return response()->json($fixedMonthlyItem);
    }

    public function destroy(FixedMonthlyItem $fixedMonthlyItem)
    {
        $fixedMonthlyItem->delete();

        return response()->json(null, 204);
    }
}
