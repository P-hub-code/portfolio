<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'name',
        'number',
        'description',
        'user_id',
        'shelf_id'
    ];

    // On delete set the parts to null using the box_id foreign key
    // This is to prevent orphaned parts using eloquent events and model observers
    public static function boot()
    {
        parent::boot();

        static::deleting(function ($box) {
            $box->parts()->update(['box_id' => null]);
        });
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = ucfirst($value);
    }

    public function parts()
    {
        return $this->hasMany(Parts::class);
    }
}
