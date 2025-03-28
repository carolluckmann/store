<?php

class Order {
    public $total;
    public $tax;

    public function __construct($total, $tax) {
         $this->total = $total;
         $this->tax = $tax;
    }
    }