<?php

namespace App\controllers;

use App\models\bll\MensajeBLL;
use App\models\dto\Mensaje;
use App\utilities\ImageUtilities;
use App\utilities\RequestUtilities;
use Exception;
use stdClass;

class MensajeController
{
    static function index()
    {
        $listaMensajes = MensajeBLL::selectAll();
        echo json_encode($listaMensajes);
    }

    static function indexByCanal($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        $listaMensajes = MensajeBLL::selectByCanalId($id);
        echo json_encode($listaMensajes);
    }

    static function detail($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        $objMensaje = RequestUtilities::getModelOr404(MensajeBLL::class, $id);
        echo json_encode($objMensaje);
    }

    static function insert($request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameters($request,
            ["fk_canal", "nombre_usuario", "titulo", "tipo", "contenido"]) ?: exit();
        $fk_canal = $request["fk_canal"];
        $nombre_usuario = $request["nombre_usuario"];
        $titulo = $request["titulo"];
        $contenido = $request["contenido"];
        $tipo = $request["tipo"];
        try {
            $id = MensajeBLL::insert($fk_canal, $nombre_usuario, $titulo, $contenido, $tipo);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objMensaje = MensajeBLL::selectById($id);
        echo json_encode($objMensaje);
    }

    static function update($id, $request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameter($id, "id") ?: exit();

        /** @var Mensaje $objMensaje */
        $objMensaje = RequestUtilities::getModelOr404(MensajeBLL::class, $id);

        $fk_canal = $objMensaje->getFkCanal();
        $nombre_usuario = $objMensaje->getNombreUsuario();
        $titulo = $objMensaje->getTitulo();
        $contenido = $objMensaje->getContenido();
        $tipo = $objMensaje->getTipo();

        if ($_SERVER["REQUEST_METHOD"] == 'PUT') {
            RequestUtilities::checkParameters($request,
                ["fk_canal", "nombre_usuario", "titulo", "contenido", "tipo"]) ?: exit();
        }
        if (isset($request["fk_canal"])) {
            $fk_canal = $request["fk_canal"];
        }
        if (isset($request["nombre_usuario"])) {
            $nombre_usuario = $request["nombre_usuario"];
        }
        if (isset($request["titulo"])) {
            $titulo = $request["titulo"];
        }
        if (isset($request["contenido"])) {
            $contenido = $request["contenido"];
        }
        if (isset($request["tipo"])) {
            $tipo = $request["tipo"];
        }
        try {
            MensajeBLL::update($id, $fk_canal, $nombre_usuario, $titulo, $contenido, $tipo);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objMensaje = MensajeBLL::selectById($id);
        echo json_encode($objMensaje);
    }

    static function delete($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        RequestUtilities::getModelOr404(MensajeBLL::class, $id);
        try {
            MensajeBLL::delete($id);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objMensaje = new \stdClass();
        $objMensaje->mensaje = "Mensaje eliminado";
        echo json_encode($objMensaje);
    }

    public static function saveImage($id, $fileRequest)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        if (isset($fileRequest["img"]) && $fileRequest["img"]["name"] != "") {
            $objMensaje = RequestUtilities::getModelOr404(MensajeBLL::class, $id);
            ImageUtilities::saveImage("img", $id, "img/mensajes/", $objMensaje->getContenido());
            $objMensaje = new stdClass();
            $objMensaje->mensaje = "Imagen guardada correctamente";
            echo json_encode($objMensaje);
        } else {
            RequestUtilities::sendError400("No se ha enviado ninguna imagen");
        }
    }
}