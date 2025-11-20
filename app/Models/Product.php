<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Image;
use App\Models\ProductVariant;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand',
        'name',
        'slug',
        'price',
        'original_price',
        'description',
        'is_trending',
        'is_sale',
    ];

    protected $casts = [
        'is_trending' => 'boolean',
        'is_sale' => 'boolean',
    ];

    /**
     * Category relationship
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Product variants (colour / size)
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Polymorphic images (product-level images)
     */
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    /**
     * ----------------------------------------------------
     * COLOURS — return unique list of colours from variants
     * ----------------------------------------------------
     */
    public function getColourAttribute()
    {
        return $this->variants()
            ->pluck('colour')
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * ----------------------------------------------------
     * COLOUR PRODUCTS — returns variants grouped by colour
     * ----------------------------------------------------
     */
    public function getColourProductsAttribute()
    {
        return $this->variants()
            ->groupBy('colour')
            ->toArray();
    }
}
