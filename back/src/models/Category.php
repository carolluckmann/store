<?php

class Category {
     
    public $name;
    public $tax;

    public function __construct($name, $tax) {
         $this->name = $name;
         $this->tax = $tax;
    }
    }