<?php

class Product {
    public $name;
    public $amount;
    public $price;
    public $category;

    public function __construct($name, $amount, $price, $category) {
         $this->name = $name;
         $this->amount = $amount;
         $this->price = $price;
         $this->category = $category;
    }
    }

