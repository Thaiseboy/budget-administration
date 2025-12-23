<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class FixedMonthlyItem extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('user', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('user_id', auth()->id());
            }
        });
    }
    protected $fillable = [
        'user_id',
        'description',
        'category',
        'amount',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
