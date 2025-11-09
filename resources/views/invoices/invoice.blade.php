<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #333;
            font-size: 14px;
            margin: 0;
            padding: 0;
        }
        .invoice-box {
            width: 90%;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 12px;
        }
        h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        th, td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
            text-align: left;
        }
        .total {
            font-weight: bold;
            font-size: 16px;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
        }
    </style>
</head>
<body>
<div class="invoice-box">
    <h1>Invoice #{{ $order->order_number }}</h1>

    <p><strong>Date:</strong> {{ $order->created_at->format('d M Y') }}</p>
    <p><strong>Customer:</strong> {{ $order->first_name }} {{ $order->last_name }}</p>
    <p><strong>Email:</strong> {{ $order->email }}</p>
    <p><strong>Address:</strong> {{ $order->address_line1 }}, {{ $order->city }}, {{ $order->postcode }}</p>

    <table>
        <thead>
        <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price (£)</th>
            <th>Total (£)</th>
        </tr>
        </thead>
        <tbody>
        @foreach ($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->unit_price, 2) }}</td>
                <td>{{ number_format($item->line_total, 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <table>
        <tr>
            <td>Subtotal:</td>
            <td class="text-right">£{{ number_format($order->subtotal, 2) }}</td>
        </tr>
        @if ($order->discount_amount > 0)
            <tr>
                <td>Discount:</td>
                <td class="text-right">-£{{ number_format($order->discount_amount, 2) }}</td>
            </tr>
        @endif
        <tr>
            <td>VAT (20%):</td>
            <td class="text-right">£{{ number_format($order->vat, 2) }}</td>
        </tr>
        <tr>
            <td>Shipping:</td>
            <td class="text-right">£{{ number_format($order->shipping, 2) }}</td>
        </tr>
        <tr class="total">
            <td>Total:</td>
            <td class="text-right">£{{ number_format($order->total, 2) }}</td>
        </tr>
    </table>

    <div class="footer">
        Thank you for your purchase!  
        <br>For any queries, contact us at support@example.com
    </div>
</div>
</body>
</html>
