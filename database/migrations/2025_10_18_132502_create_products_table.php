<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type'); // e.g. "MENS HOODIES", "TRENDING SHOES"
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->json('sizes')->nullable();           // NEW
            $table->json('colour')->nullable();          // NEW
            $table->text('specifications')->nullable(); // NEW
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
