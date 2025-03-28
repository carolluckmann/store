<?php
include_once("./controller/categoryController.php");
include_once("./controller/productController.php");
include_once("./controller/orderItemController.php");
include_once("./controller/orderController.php");
$orderController = new OrderController;
$orderItemController = new OrderItemController;
$productController = new ProductController;
$categoryController = new CategoryController;

$routes = [
    '/order' => 'order',
    '/order/id' => 'specificOrder',
    '/active-order' => 'activeOrder',
    '/canceled-order' => 'cancelOrder',
    '/set-increment' => 'setIncrement',
    '/set-active-false' => 'setActiveFalse',
    '/get-order-false' => 'getOrderFalse',
    '/update-orders' => 'updateOrders',
    '/set-decrement' => 'setDecrement',
    '/history-items/id' => 'getHistoryItems',
    '/products' => 'products',
    '/products/id' => 'specificProduct',
    '/categories' => 'categories',
    '/categories/id' => 'specificCategory',
    '/order-item' => 'orderItem',
    '/order-item/id' => 'specificOrderItem',
];

function products() {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $productController;
        $data = json_decode(file_get_contents('php://input'), true);
        $productController->createProduct($data);
    };
        
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $productController;
        $productController->getAllProducts();
    }
}
    
function categories() {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $categoryController;
        $data = json_decode(file_get_contents('php://input'), true);
        $categoryController->createCategory($data);
    };

    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $categoryController;
        $categoryController->getAllCategories();
    }
}

function order(){
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $orderController;
        $orderController->createOrder();
    };

    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderController;
        $orderController->getAllOrders();
    }
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $orderController;
        $orderController->deleteOrder($id);
    };
}

function activeOrder(){
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderController;
        $orderController->getActiveOrder();
    };
}

function cancelOrder(){
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $orderItemController;
        $orderItemController->cancelOrder();
};
}

function setActiveFalse(){
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderController;
        $orderController->setActiveFalse();
    };
}

function getOrderFalse(){
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderController;
        $orderController->getOrderFalse();
    };
}

function getHistoryItems($id){
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderItemController;
        $orderItemController->getHistoryItems($id);
    };
}

function setIncrement(){
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $orderItemController;
        $data = json_decode(file_get_contents('php://input'), true);
        $orderItemController->setIncrement($data);
    };
}

function setDecrement(){
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $productController;
        $data = json_decode(file_get_contents('php://input'), true);
        $productController->setDecrement($data);
    };
}

function updateOrders(){
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $orderController;
        $data = json_decode(file_get_contents('php://input'), true);
        $orderController->updateOrders($data);
    };
}

function orderItem(){
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        global $orderItemController;
        $data = json_decode(file_get_contents('php://input'), true);
        $orderItemController->createOrderItem($data);
    };

    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        global $orderItemController;
        $orderItemController->getAllOrderItems();
    };
}

function specificOrder($id){
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $orderController;
        $orderController->deleteOrder($id);
    };
    if($_SERVER['REQUEST_METHOD'] === 'GET'){
        global $orderController;
        $orderController->getOrderById($id);
    }
}

function specificOrderItem($id){
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $orderItemController;
        $orderItemController->deleteOrderItem($id);
    } 
    elseif($_SERVER['REQUEST_METHOD'] === 'GET'){
        global $orderItemController;
        $orderItemController->getOrderItemsById($id);
    }
}

function specificCategory($id) {
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $categoryController;
        $categoryController->deleteCategory($id);
    };
}

function specificProduct($id) {
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $productController;
        $productController->deleteProduct($id);
    };
    if($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        global $orderItemController;
        $orderItemController->deleteOrderItem($id);
    } 
}

function handleRequest($uri, $routes) {
    $args = explode('/', $uri);
    if (isset($args[2])) {
        if(array_key_exists(('/' . $args[1] . '/id'), $routes)) {
            $function = $routes['/' . $args[1] . '/id'];
            $function($args[2]);
        } else {
            echo "<h1>Error 404:</h1> Page Not Found.";
        }
    } elseif (isset($args[1])) {
        if(array_key_exists(('/' . $args[1]), $routes)) {
            $function = $routes['/' . $args[1]];
            $function();
        } else {
            echo "<h1>Error 404:</h1> Page Not Found.";
        }
    }
}

?>