<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peca extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',

        'sku',
        'nom',
        'description',
        'marque',
        'modele',
        'annee',
        'prix',
        'image',
        'quantite',

        'categorie_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
