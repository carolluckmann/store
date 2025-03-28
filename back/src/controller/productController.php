<?php
require_once("./models/Product.php");
require_once("./models/Category.php");
require_once("./repository/productRepository.php");
require_once("./controller/categoryController.php");
 
class ProductController {
    private $productRepository;
 
    public function __construct() {
        $this->productRepository = new ProductRepository();
    }
 
    public function getCategories() {
        $category = $this->categoryRepository->getCategories();
 
        if ($category) {
            echo json_encode($category);
        } else {
            echo json_encode([]);
        }
    }

    public function getProducts() {
        $product = $this->productRepository->getProducts();
 
        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode([]);
        }
    }

    public function getAllProducts() {
        $product = $this->productRepository->getAllProducts();
 
        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode([]);
        }
    }

    public function createProduct($data) {
            $product = new Product($data['name'], $data['amount'], $data['price'], $data['category']);
            $this->productRepository->createProduct((array)$product);
    }
 
    public function deleteProduct($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $this->productRepository->deleteProduct($id);
        }
    }

    public function setDecrement($data){
        $this->productRepository->setDecrement($data);
    }
}
 
?>