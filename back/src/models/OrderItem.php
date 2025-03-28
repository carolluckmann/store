<?php
class OrderItem {
    public $product;
    public $order;
    public $amount;
    public $price;
    public $tax;

    public function __construct($product, $order, $amount, $price, $tax) {
        $this->product = $product;
        $this->order = $order;
        $this->amount= $amount;
        $this->price = $price;
        $this->tax = $tax;
    }
    }