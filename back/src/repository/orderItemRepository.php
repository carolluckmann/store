<?php 
require_once("./models/Product.php");
require_once("./models/OrderItem.php");
require_once("./controller/productController.php");
require_once("./controller/orderItemController.php");
require_once("./db.php");

class OrderItemRepository {
    private $conn;

    public function __construct() {
        $this->conn = new Database();
    }

    public function getOrderItem($name) {
        $sql = "SELECT FROM order_item WHERE name = :name";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
    }

    public function getAllOrderItems(){
        $sql = "SELECT * FROM order_item";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllOrders(){
        $sql = "SELECT * FROM orders";
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

    public function createOrderItem($data) {
        $sql = "INSERT INTO order_item (order_code, product_code, amount, price, tax) VALUES (:order, :product, :amount, :price, :tax)";
        $stmt = $this->conn->getConnection()->prepare($sql);  
        $stmt->bindParam(':order', $data['order']);
        $stmt->bindParam(':product', $data['product']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':tax', $data['tax']);
        $stmt->execute();
    }

    public function deleteOrderItem($id) {
        $sql = "DELETE FROM order_item WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public function getOrderItemsById($id){
        $sql = "SELECT * FROM order_item WHERE order_code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }   

    public function cancelOrder(){
        $sql = "DELETE FROM order_item WHERE order_code IN (SELECT order_code from order_item INNER JOIN orders ON order_item.order_code = orders.code WHERE orders.active = true)";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
    }
    
    public function setIncrement($data) {
        $sql = "UPDATE ORDER_ITEM SET amount = :amount WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $data['code']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->execute();
     }

     public function getHistoryItems($id){
        $sql = "SELECT * FROM order_item INNER JOIN orders ON order_item.order_code = orders.code WHERE orders.active = false AND order_item.product_code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
     }
}
?>