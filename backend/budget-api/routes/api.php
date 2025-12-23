<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CategoryBudgetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MonthlyPlanController;
use App\Http\Controllers\Api\FixedMonthlyItemController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ProfileController;

// Public auth routes
Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

// Protected auth routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/user', UserController::class);

    // Email verification routes
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
    Route::get('/email/verification-status', [EmailVerificationController::class, 'checkStatus']);

    // Profile routes
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // Protected budget app routes
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
    Route::post('/categories/merge', [CategoryController::class, 'merge']);
});
