<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'email',
        'subtotal',
        'discount_code',
        'discount_amount',
        'vat',
        'shipping',
        'total',
        'payment_intent_id',
        'status',
        'first_name',
        'last_name',
        'phone',
        'address_line1',
        'address_line2',
        'city',
        'postcode',
        'country',
        'invoice_path', // store PDF location
    ];

    // Append computed attributes automatically
    protected $appends = ['invoice_url'];

    /**
     * Relationships
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor for invoice URL
     */
    public function getInvoiceUrlAttribute()
    {
        if ($this->invoice_path) {
            return asset('storage/' . $this->invoice_path);
        }
        return null;
    }

    /**
     * Automatically generate PDF invoice when order is created
     */
    protected static function booted()
    {
        static::created(function ($order) {
            try {
                // Load the invoice Blade view
                $pdf = Pdf::loadView('invoices.invoice', ['order' => $order]);

                // Define save location in storage/app/public/invoices
                $filePath = 'public/invoices/invoice-' . $order->order_number . '.pdf';

                // Save the PDF
                Storage::put($filePath, $pdf->output());

                // Update order with file path (without 'public/' prefix for asset())
                $order->update([
                    'invoice_path' => str_replace('public/', '', $filePath),
                ]);

            } catch (\Exception $e) {
                Log::error('Invoice generation failed for order ' . $order->order_number . ': ' . $e->getMessage());
            }
        });
    }
}
