<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends \Illuminate\Database\Eloquent\Model<\App\Models\Parts>
 * @property int $id
 * @property string $sku
 * @property string $name
 * @property string $description
 * @property string $brand
 * @property string $model
 * @property string $year
 * @property string $price
 * @property string $image
 * @property string $quantity
 * @property int $user_id
 * @property int $box_id
 */
class Parts extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'brand',
        'model',
        'year',
        'price',
        'image',
        'quantity',
        'user_id',
        'box_id',
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucfirst($value);
    }

    public function setBrandAttribute($value)
    {
        $this->attributes['brand'] = ucfirst($value);
    }

    public function setModelAttribute($value)
    {
        $this->attributes['model'] = ucfirst($value);
    }

    public function box()
    {
        return $this->belongsTo(Box::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function partsSales()
    {
        return $this->hasMany(PartsSales::class);
    }
}
