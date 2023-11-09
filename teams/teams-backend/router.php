<?php

use App\controllers\CanalController;
use App\controllers\EquipoController;
use App\controllers\MensajeController;
use App\utilities\RequestUtilities;

if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
    exit();
}
RequestUtilities::url("equipo", "list", "GET", function () {
    EquipoController::index();
});
RequestUtilities::url("equipo", "detail", "GET", function () {
    EquipoController::detail($_GET["id"]);
});
RequestUtilities::url("equipo", "insert", "POST", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    EquipoController::insert($body);
});
RequestUtilities::url("equipo", "update", "PUT,PATCH", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    EquipoController::update($_GET["id"], $body);
});
RequestUtilities::url("equipo", "delete", "DELETE", function () {
    EquipoController::delete($_GET["id"]);
});
RequestUtilities::url("canal", "list", "GET", function () {
    CanalController::index();
});
RequestUtilities::url("canal", "listByEquipo", "GET", function () {
    CanalController::indexByEquipo($_GET["id"]);
});
RequestUtilities::url("canal", "detail", "GET", function () {
    CanalController::detail($_GET["id"]);
});
RequestUtilities::url("canal", "insert", "POST", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    CanalController::insert($body);
});
RequestUtilities::url("canal", "update", "PUT,PATCH", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    CanalController::update($_GET["id"], $body);
});
RequestUtilities::url("canal", "delete", "DELETE", function () {
    CanalController::delete($_GET["id"]);
});
RequestUtilities::url("mensaje", "list", "GET", function () {
    MensajeController::index();
});
RequestUtilities::url("mensaje", "listByCanal", "GET", function () {
    MensajeController::indexByCanal($_GET["id"]);
});
RequestUtilities::url("mensaje", "detail", "GET", function () {
    MensajeController::detail($_GET["id"]);
});
RequestUtilities::url("mensaje", "insert", "POST", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    MensajeController::insert($body);
});
RequestUtilities::url("mensaje", "update", "PUT,PATCH", function () {
    $body = json_decode(file_get_contents('php://input'), true);
    MensajeController::update($_GET["id"], $body);
});
RequestUtilities::url("mensaje", "delete", "DELETE", function () {
    MensajeController::delete($_GET["id"]);
});
RequestUtilities::url("mensaje", "saveImage", "POST", function () {
    MensajeController::saveImage($_GET["id"], $_FILES);
});