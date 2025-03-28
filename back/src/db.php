<?php

class Database {
    private $pdo;
    private $host = "pgsql_desafio";
    private $db = "applicationphp";
    private $user = "root";
    private $pw = "root";

    public function __construct() {
        $this->pdo = new PDO("pgsql:host=$this->host;dbname=$this->db", $this->user, $this->pw);
    }

    public function getConnection() {
        return $this->pdo;
    }
}

?>