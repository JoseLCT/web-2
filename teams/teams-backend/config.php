<?php
require_once "vendor/autoload.php";
$username= "root";
$password= "root";
$hostname= "localhost";
$port= "3306";
$dbname= "db_teams";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");