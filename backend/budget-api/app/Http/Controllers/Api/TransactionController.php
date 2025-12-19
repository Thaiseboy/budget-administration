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
                'id' => $transaction->id,
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
            'date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        // Set today as default
        if (empty($data['date'])) {
            $data['date'] = now()->format('Y-m-d');
        }

        $transaction = Transaction::create($data);

        return response()->json([
            'id' => $transaction->id,
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

    public function show(Transaction $transaction)
    {
        return response()->json([
            'id' => $transaction->id,
            'type' => $transaction->type,
            'amount' => (float) $transaction->amount,
            'description' => $transaction->description,
            'category' => $transaction->category,
            'date' => $transaction->date->format('Y-m-d'),
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'type' => ['required', 'in:income,expense'],
            'amount' => ['required', 'numeric'],
            'date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        // Set vandaag als date niet meegegeven is
        if (empty($data['date'])) {
            $data['date'] = now()->format('Y-m-d');
        }

        $transaction->update($data);

        return response()->json([
            'id' => $transaction->id,
            'type' => $transaction->type,
            'amount' => (float) $transaction->amount,
            'description' => $transaction->description,
            'category' => $transaction->category,
            'date' => $transaction->date->format('Y-m-d'),
        ]);
    }
}
