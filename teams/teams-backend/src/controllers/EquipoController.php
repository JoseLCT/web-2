<?php

namespace App\controllers;

use App\models\bll\EquipoBLL;
use App\models\dto\Equipo;
use App\utilities\RequestUtilities;
use Exception;

class EquipoController
{
    static function index()
    {
        $listaEquipos = EquipoBLL::selectAll();
        echo json_encode($listaEquipos);
    }

    static function detail($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        $objEquipo = RequestUtilities::getModelOr404(EquipoBLL::class, $id);
        echo json_encode($objEquipo);
    }

    static function insert($request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameters($request,
            ["nombre", "descripcion"]) ?: exit();
        $nombre = $request["nombre"];
        $descripcion = $request["descripcion"];
        try {
            $id = EquipoBLL::insert($nombre, $descripcion);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objEquipo = EquipoBLL::selectById($id);
        echo json_encode($objEquipo);
    }

    static function update($id, $request)
    {
        RequestUtilities::checkEmptyBody($request);
        RequestUtilities::checkParameter($id, "id") ?: exit();

        /** @var Equipo $objEquipo */
        $objEquipo = RequestUtilities::getModelOr404(EquipoBLL::class, $id);

        $nombre = $objEquipo->getNombre();
        $descripcion = $objEquipo->getDescripcion();

        if ($_SERVER["REQUEST_METHOD"] == 'PUT') {
            RequestUtilities::checkParameters($request,
                ["nombre", "descripcion"]) ?: exit();
        }
        if (isset($request["nombre"])) {
            $nombre = $request["nombre"];
        }
        if (isset($request["descripcion"])) {
            $descripcion = $request["descripcion"];
        }
        try {
            EquipoBLL::update($id, $nombre, $descripcion);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objEquipo = EquipoBLL::selectById($id);
        echo json_encode($objEquipo);
    }

    static function delete($id)
    {
        RequestUtilities::checkParameter($id, "id") ?: exit();
        RequestUtilities::getModelOr404(EquipoBLL::class, $id);
        try {
            EquipoBLL::delete($id);
        } catch (Exception $e) {
            RequestUtilities::sendError500($e);
            return;
        }
        $objMensaje = new \stdClass();
        $objMensaje->mensaje = "Equipo eliminado";
        echo json_encode($objMensaje);
    }
}