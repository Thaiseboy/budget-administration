<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::orderBy('date', 'desc')->get();

        return $transactions->map(function ($transaction) {
            return [
                'id' => (string) $transaction->id,
                'type' => $transaction->type,
                'amount' => (float) $transaction->amount,
                'description' => $transaction->description,
                'category' => $transaction->category,
                'date' => $transaction->date->format('Y-m-d'),
            ];
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $transaction = Transaction::create($data);

        return response()->json([
            'id' => (string) $transaction->id,
            'type' => $transaction->type,
            'amount' => (float) $transaction->amount,
            'description' => $transaction->description,
            'category' => $transaction->category,
            'date' => $transaction->date->format('Y-m-d'),
        ], 201);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        // HTTP 204
        return response()->noContent();
    }
}
