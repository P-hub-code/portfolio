<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends \Illuminate\Database\Eloquent\Model<\App\Models\PartsSales>
 * @property int $id
 * @property int $user_id - The user who made the sale
 * @property int $part_id - The part that was sold
 * @property string $date
 * @property string $price
 * @property string $quantity
 * @property string $notes
 */
class PartsSales extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'part_id',
        'date',
        'price',
        'quantity',
        'notes',
    ];

    public function part()
    {
        return $this->belongsTo(Parts::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
