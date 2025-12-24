<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Create transactions for test user
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 2500,
            'description' => 'Salary',
            'category' => 'Work',
            'date' => '2025-12-01',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'expense',
            'amount' => 65.40,
            'description' => 'Groceries',
            'category' => 'Food',
            'date' => '2025-12-03',
        ]);
    }
}
