<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('brand');
            $table->string('name');
            $table->string('slug')->unique();

            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable(); // Sale price

            $table->text('description')->nullable();

            $table->boolean('is_trending')->default(false);
            $table->boolean('is_sale')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
