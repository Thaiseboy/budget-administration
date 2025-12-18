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
        Transaction::create([
            'type' => 'income',
            'amount' => 2500,
            'description' => 'Salary',
            'category' => 'Work',
            'date' => '2025-12-01',
        ]);

        Transaction::create([
            'type' => 'expense',
            'amount' => 65.40,
            'description' => 'Groceries',
            'category' => 'Food',
            'date' => '2025-12-03',
        ]);
    }
}
