<?php
require_once("./models/Product.php");
require_once("./models/OrderItem.php");
require_once("./models/Order.php");
require_once("./controller/orderController.php");
require_once("./controller/productController.php");
require_once("./repository/orderItemRepository.php");

class OrderItemController {
    private $orderItemRepository;
 
    public function __construct() {
        $this->orderItemRepository = new OrderItemRepository();
    }

    public function getProducts() {
        $product = $this->productRepository->getProducts();
 
        if ($product) {
            echo json_encode($product);
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

    public function getOrderItems() {
        $orderItem = $this->orderItemRepository->getOrderItems();
 
        if ($orderItem) {
            echo json_encode($orderItem);
        } else {
            echo json_encode([]);
        }
    }

    public function getAllOrderItems() {
        $orderItem = $this->orderItemRepository->getAllOrderItems();
 
        if ($orderItem) {
            echo json_encode($orderItem);
        } else {
            echo json_encode([]);
        }
    }
 
    public function createOrderItem($data) {
        $orderItem = new OrderItem($data['product'], $data['order'], $data['amount'], $data['price'], $data['tax']);
        $this->orderItemRepository->createOrderItem((array)$orderItem);
    }

    public function deleteOrderItem($id) {
            $this->orderItemRepository->deleteOrderItem($id);
    }

    public function getOrderItemsById($id){
        $orderItem = $this->orderItemRepository->getOrderItemsById($id);
        if ($orderItem) {
            echo json_encode($orderItem);
        } else {
            echo json_encode([]);
        }
    }

    public function cancelOrder(){
        $orderItem = $this->orderItemRepository->cancelOrder();
        if ($orderItem) {
            echo json_encode($orderItem);
            return $orderItem;
        } else {
            echo json_encode([]);
        }
    }

    public function setIncrement($data){
        $this->orderItemRepository->setIncrement($data);
    }

    public function getHistoryItems($id){
        $orderItem = $this->orderItemRepository->getHistoryItems($id);
        if ($orderItem) {
            echo json_encode($orderItem);
        } else {
            echo json_encode([]);
        }
    }
}
 