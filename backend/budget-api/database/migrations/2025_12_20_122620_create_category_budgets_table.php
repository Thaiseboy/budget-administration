<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('category_budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('year');
            $table->unsignedTinyInteger('month'); // 1-12
            $table->string('category', 255);
            $table->decimal('amount', 10, 2);
            $table->timestamps();

            $table->unique(['user_id', 'year', 'month', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_budgets');
    }
};
