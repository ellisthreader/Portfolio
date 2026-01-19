<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    {{-- Force Landscape Page --}}
    <style>
        @page {
            size: A4 landscape;
            margin: 20px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 0;
            background: #f2f4f8;
            color: #333;
            font-size: 13px;
        }

        .invoice-wrapper {
            background: #fff;
            padding: 25px 35px;
            border-radius: 10px;
            width: 100%;
            min-height: 100%;
            box-sizing: border-box;
            border: 1px solid #dce3eb;
        }

        .header {
            border-bottom: 3px solid #4a90e2;
            padding-bottom: 12px;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 26px;
            margin: 0;
            color: #4a90e2;
        }

        .two-col {
            width: 100%;
        }
        .two-col td {
            vertical-align: top;
            padding: 3px 0;
        }

        .section-title {
            font-size: 17px;
            font-weight: bold;
            margin: 25px 0 10px;
            color: #444;
            border-left: 4px solid #4a90e2;
            padding-left: 10px;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 25px;
        }

        .items-table th {
            background: #4a90e2;
            color: #fff;
            padding: 10px;
            font-size: 13px;
            text-align: left;
        }

        .items-table td {
            border-bottom: 1px solid #e6e6e6;
            padding: 9px 10px;
        }

        .summary-table {
            width: 35%;
            margin-left: auto;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 7px 0;
        }

        .summary-label {
            font-weight: bold;
            color: #444;
        }

        .summary-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #4a90e2;
            padding-top: 10px;
            color: #000;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            color: #666;
        }
    </style>
</head>

<body>

<div class="invoice-wrapper">

    <!-- HEADER -->
    <div class="header">
        <h1>Invoice #{{ $order->order_number }}</h1>
        <p style="margin:5px 0 0; color:#666;">Date: {{ $order->created_at->format('d M Y') }}</p>
    </div>


    <!-- CUSTOMER DETAILS -->
    <div class="section-title">Billing Information</div>

    <table class="two-col">
        <tr>
            <td><strong>Name:</strong></td>
            <td>{{ $order->first_name }} {{ $order->last_name }}</td>
        </tr>
        <tr>
            <td><strong>Email:</strong></td>
            <td>{{ $order->email }}</td>
        </tr>
        <tr>
            <td><strong>Address:</strong></td>
            <td>{{ $order->address_line1 }}, {{ $order->city }}, {{ $order->postcode }}</td>
        </tr>
    </table>

    <!-- ORDER ITEMS -->
    <div class="section-title">Order Details</div>

    <table class="items-table">
        <thead>
        <tr>
            <th style="width:50%">Product</th>
            <th style="width:10%">Qty</th>
            <th style="width:20%">Price (£)</th>
            <th style="width:20%">Total (£)</th>
        </tr>
        </thead>

        <tbody>
        @foreach ($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>£{{ number_format($item->unit_price, 2) }}</td>
                <td>£{{ number_format($item->line_total, 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>


    <!-- TOTALS -->
    <table class="summary-table">
        <tr>
            <td class="summary-label">Subtotal:</td>
            <td>£{{ number_format($order->subtotal, 2) }}</td>
        </tr>

        @if ($order->discount_amount > 0)
            <tr>
                <td class="summary-label">Discount:</td>
                <td>-£{{ number_format($order->discount_amount, 2) }}</td>
            </tr>
        @endif

        <tr>
            <td class="summary-label">VAT (20%):</td>
            <td>£{{ number_format($order->vat, 2) }}</td>
        </tr>

        <tr>
            <td class="summary-label">Shipping:</td>
            <td>£{{ number_format($order->shipping, 2) }}</td>
        </tr>

        <tr class="summary-total">
            <td>Total:</td>
            <td>£{{ number_format($order->total, 2) }}</td>
        </tr>
    </table>

    <!-- FOOTER -->
    <div class="footer">
        Thank you for shopping with us!  
        <br>For support contact <strong>support@example.com</strong>
    </div>

</div>

</body>
</html>
