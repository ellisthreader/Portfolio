<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'name',
        'slug',
        'type',
        'price',
        'original_price',
        'description',
        'images',
        'sizes',
        'colour',
        'product_specifications',
    ];

    protected $casts = [
        'images' => 'array',
        'sizes' => 'array',
        'colour' => 'array',
    ];
}
