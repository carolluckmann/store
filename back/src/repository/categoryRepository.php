<?php 

require_once("./models/Category.php");
require_once("./controller/categoryController.php");
require_once("./db.php");

class CategoryRepository {
    private $conn;

    public function __construct() {
        $this->conn = new Database();
    }

    public function getCategories() {
        $sql = "SELECT FROM categories WHERE name = :name";
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

    public function createCategory($data) {
        $sql = "INSERT INTO categories (name, tax) VALUES (:name, :tax)";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':tax', $data['tax']);
        $stmt->execute();
    }

    public function deleteCategory($id) {
        $sql = "DELETE FROM categories WHERE code = :id";
        $stmt = $this->conn->getConnection()->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }
}
?>
