<?php

require_once("./models/Product.php");
require_once('./models/Order.php');
// require_once("./models/Category.php");
// require_once("./controller/categoryController.php");
require_once("./controller/productController.php");
require_once("./models/OrderItem.php");
require_once("./controller/orderItemController.php");
require_once("./repository/orderRepository.php");

class OrderController {
    private $orderRepository;
 
    public function __construct() {
        $this->orderRepository = new OrderRepository();
    }
    
    public function getProducts(){
        $product = $this->productRepository->getProducts();
 
        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode([]);
        }
    }

    public function getOrderItems() {
        $orderItem = $this->orderItemRepository->getOrderItems();
 
        if ($orderItem) {
            echo json_encode($orderItem);
        } else {
            echo json_encode([]);
        }
    }

    public function getOrders() {
        $order = $this->orderRepository->getOrders();
 
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode([]);
        }
    }

    public function getAllOrders(){
        $order = $this->orderRepository->getAllOrders();
 
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode([]);
        }
    }

    public function createOrder(){
            $order = $this->getActiveOrder();
            if ($order) {
                $this->deleteOrder($order["code"]);
            }
            $this->orderRepository->createOrder();
        }

    public function deleteOrder($id){
        $this->orderRepository->deleteOrder($id);
    }

    public function getActiveOrder(){
        $order = $this->orderRepository->getActiveOrder();
        if ($order) {
            echo json_encode($order);
            return $order;
        } else {
            echo json_encode([]);
        }
    }
    
    public function getOrderById($id){
        $order = $this->orderRepository->getOrderById($id);
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode([]);
        }
    }

    public function setActiveFalse(){
        $order = $this->orderRepository->setActiveFalse();
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode([]);
        }
    }

    public function getOrderFalse(){
        $order = $this->orderRepository->getOrderFalse();
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode([]);
        }
    }

    public function updateOrders($data){
        $this->orderRepository->updateOrders($data["tax"],$data["total"], $data["id"]);
    }
}

