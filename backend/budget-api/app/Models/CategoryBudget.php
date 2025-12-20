<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryBudget extends Model
{
    protected $fillable = ['year', 'month', 'category', 'amount'];
}
