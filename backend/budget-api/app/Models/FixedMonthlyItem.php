<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FixedMonthlyItem extends Model
{
    protected $fillable = [
        'description',
        'category',
        'amount',
        'type',
    ];
}
