<?php

namespace App\controllers;

use App\models\bll\CanalBLL;
use App\models\dto\Canal;
use App\utilities\RequestUtilities;
use Exception;

class CanalController
{
    static function index()
    {
        $listaCanales = CanalBLL::selectAll();
        echo json_encode($listaCanales);
    }

    static function indexByEquipo($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        $listaCanales = CanalBLL::selectByEquipoId($id);
        echo json_encode($listaCanales);
    }

    static function detail($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        $objCanal = RequestUtilities::getModelOr404(CanalBLL::class, $id);
        echo json_encode($objCanal);
    }

    static function insert($request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameters($request,
            ["fk_equipo", "nombre"]) ?: exit();
        $fk_equipo = $request["fk_equipo"];
        $nombre = $request["nombre"];
        try {
            $id = CanalBLL::insert($fk_equipo, $nombre);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objCanal = CanalBLL::selectById($id);
        echo json_encode($objCanal);
    }

    static function update($id, $request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameter($id, "id") ?: exit();

        /** @var Canal $objCanal */
        $objCanal = RequestUtilities::getModelOr404(CanalBLL::class, $id);

        $fk_equipo = $objCanal->getFkEquipo();
        $nombre = $objCanal->getNombre();

        if ($_SERVER["REQUEST_METHOD"] == 'PUT') {
            RequestUtilities::checkParameters($request,
                ["fk_equipo", "nombre"]) ?: exit();
        }
        if (isset($request["fk_equipo"])) {
            $fk_equipo = $request["fk_equipo"];
        }
        if (isset($request["nombre"])) {
            $nombre = $request["nombre"];
        }
        try {
            CanalBLL::update($id, $fk_equipo, $nombre);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objCanal = CanalBLL::selectById($id);
        echo json_encode($objCanal);
    }

    static function delete($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        RequestUtilities::getModelOr404(CanalBLL::class, $id);
        try {
            CanalBLL::delete($id);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objMensaje = new \stdClass();
        $objMensaje->mensaje = "Canal eliminado";
        echo json_encode($objMensaje);
    }
}