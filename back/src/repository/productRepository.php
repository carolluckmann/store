<?php 

require_once("./models/Product.php");
require_once("./controller/productController.php");
require_once("./models/Category.php");
require_once("./controller/categoryController.php");
require_once("./db.php");

class ProductRepository {
    private $conn;

    public function __construct() {
        $this->conn = new Database();
    }

    public function getProducts() {
        $sql = "SELECT FROM products WHERE name = :name ORDER BY code";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
    }

    public function getAllCategories() {
        $sql = "SELECT * FROM categories";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllProducts() {
        $sql = "SELECT * FROM products ORDER BY code";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createProduct($data) {
        $sql = "INSERT INTO products (name, amount, price, category_code) VALUES (:name, :amount, :price, :category)";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->execute();
    }

    public function deleteProduct($id) {
        $sql = "DELETE FROM products WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public function setDecrement($data){
        $sql = "UPDATE products SET amount = :amount WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $data['code']);
        $stmt->bindParam(':amount', $data['amount']);
        $stmt->execute();
     }
}
?>