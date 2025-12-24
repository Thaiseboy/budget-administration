<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CategoryBudget extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('user', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('user_id', auth()->id());
            }
        });
    }
    protected $fillable = ['user_id', 'year', 'month', 'category', 'amount'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
