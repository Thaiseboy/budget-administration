<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::orderBy('date', 'desc')->get();
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

        return response()->json($transaction, 201);
    }
}
