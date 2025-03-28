<?php

require_once("./models/Product.php");
require_once("./models/OrderItem.php");
require_once("./models/Order.php");
require_once("./controller/productController.php");
require_once("./controller/orderItemController.php");
require_once("./controller/orderController.php");
require_once("./db.php");

class OrderRepository {
    private $conn;

    public function __construct() {
        $this->conn = new Database();
    }

    public function getOrders() {
        $sql = "SELECT FROM orders WHERE code = :name";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
    }

    public function getAllOrders(){
        $sql = "SELECT * FROM orders";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllOrderItems(){
        $sql = "SELECT * FROM order_item";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllProducts() {
        $sql = "SELECT * FROM products";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createOrder() {
        $sql = "INSERT INTO orders (tax, total, active) VALUES (0, 0, true)";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
    }

    public function deleteOrder($id){
        $sql = "UPDATE orders SET active = false WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public function getActiveOrder(){
        $sql = "SELECT * FROM orders WHERE active = true";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($orderData) {
            return $orderData;
        } else {
            return null;
        }
    }

    public function getOrderById($id){
        $sql = "SELECT * FROM orders WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   public function setActiveFalse(){
        $sql = "UPDATE orders SET active = false WHERE active = true";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($orderData) {
            return $orderData;
        } else {
            return null;
        }
   }

   public function getOrderFalse(){
    $sql = "SELECT * FROM orders WHERE active = false ORDER BY code";
    $stmt = $this->conn->getConnection()->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
   }

   public function updateOrders($tax, $total, $id){
    $sql = "UPDATE orders SET tax = :tax, total = :total WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':tax', $tax);
        $stmt->bindParam(':total', $total);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($orderData) {
            return $orderData;
        } else {
            return null;
        }
   }
}