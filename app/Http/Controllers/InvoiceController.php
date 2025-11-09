<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Order;

class InvoiceController extends Controller
{
    public function download($orderId)
    {
        $order = Order::with('items')->findOrFail($orderId);

        // ✅ Correct view
        $pdf = Pdf::loadView('invoices.invoice', compact('order'));

        return $pdf->download('invoice-' . $order->order_number . '.pdf');
    }

    public function preview($orderId)
    {
        $order = Order::with('items')->findOrFail($orderId);

        $pdf = Pdf::loadView('invoices.invoice', compact('order'));

        return $pdf->stream('invoice-' . $order->order_number . '.pdf');
    }
}
