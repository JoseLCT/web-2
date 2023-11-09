<?php

namespace App\utilities;

class RequestUtilities
{
    public static function url($controller, $action, $method, \Closure $resultCall)
    {
        if (!isset($_REQUEST["controller"]) || $_REQUEST["controller"] != $controller
            || !isset($_REQUEST["action"]) || $_REQUEST["action"] != $action) {
            return;
        }
        $splitted = explode(",", $method);
        if (!in_array($_SERVER['REQUEST_METHOD'], $splitted)) {
            http_response_code(405);
            return;
        }
        $resultCall();
        exit();
    }

    public static function checkEmptyBody($request)
    {
        if ($request == '') {
            $objMensaje = new \stdClass();
            $objMensaje->error = "El body no puede estar vacio";
            echo json_encode($objMensaje);
            http_response_code(400);
            exit();
        }
    }

    public static function checkParameters($request, $paramNames)
    {
        foreach ($paramNames as $paramName) {
            if (!isset($request[$paramName]) || $request[$paramName] == "") {
                $objMensaje = new \stdClass();
                $objMensaje->error = "El $paramName es requerido";
                echo json_encode($objMensaje);
                http_response_code(400);
                return false;
            }
        }
        return true;
    }

    public static function checkParameter($id, $paramName)
    {
        if (!isset($id) || $id == "") {
            $objMensaje = new \stdClass();
            $objMensaje->error = "El $paramName es requerido";
            echo json_encode($objMensaje);
            http_response_code(400);
            return false;
        }
        return true;
    }

    public static function getModelOr404($class, $id)
    {
        $obj = $class::selectById($id);
        if ($obj == null) {
            $objMensaje = new \stdClass();
            $objMensaje->error = "Objeto no encontrado";
            echo json_encode($objMensaje);
            http_response_code(404);
            exit();
        }
        return $obj;
    }

    public static function sendError500(\Exception $e)
    {
        $objMensaje = new \stdClass();
        $objMensaje->error = "Error al actualizar persona";
        $objMensaje->debugError = $e->getMessage();
        echo json_encode($objMensaje);
        http_response_code(500);
    }

    public static function sendError400($message)
    {
        $objMensaje = new \stdClass();
        $objMensaje->error = $message;
        echo json_encode($objMensaje);
        http_response_code(400);
    }
}