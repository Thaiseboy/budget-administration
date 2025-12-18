<?php

use Illuminate\Support\Facades\Route;

Route::get('/transactions', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'description' => 'Test transaction',
                'amount' => 100.00,
                'date' => '2024-12-18'
            ]
        ]
    ]);
});
