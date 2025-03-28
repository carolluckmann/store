<?php
require_once("./models/Category.php");
require_once("./repository/categoryRepository.php");
 
class CategoryController {
    private $categoryRepository;
 
    public function __construct() {
        $this->categoryRepository = new CategoryRepository();
    }
 
    public function getCategories() {
        $category = $this->categoryRepository->getCategories();
 
        if ($category) {
            echo json_encode($category);
        } else {
            echo json_encode([]);
        }
    }
 
    public function getAllCategories() {
        $category = $this->categoryRepository->getAllCategories();
 
        if ($category) {
            echo json_encode($category);
        } else {
            echo json_encode([]);
        }
    }
 
    public function createCategory($data) {
            $category = new Category($data['name'], $data['tax']);
            $this->categoryRepository->createCategory((array)$category);
    }
 
    public function deleteCategory($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $this->categoryRepository->deleteCategory($id);
        }
    }
}
?>