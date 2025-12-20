<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CategoryBudgetController;
use App\Http\Controllers\Api\MonthlyPlanController;
use App\Http\Controllers\Api\FixedMonthlyItemController;

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
Route::get('/budgets', [CategoryBudgetController::class, 'index']);
Route::put('/budgets', [CategoryBudgetController::class, 'upsert']);
Route::get('/month-plan', [MonthlyPlanController::class, 'show']);
Route::put('/month-plan', [MonthlyPlanController::class, 'upsert']);
Route::get('/fixed-items', [FixedMonthlyItemController::class, 'index']);
Route::post('/fixed-items', [FixedMonthlyItemController::class, 'store']);
Route::put('/fixed-items/{fixedMonthlyItem}', [FixedMonthlyItemController::class, 'update']);
Route::delete('/fixed-items/{fixedMonthlyItem}', [FixedMonthlyItemController::class, 'destroy']);
