<?php

namespace App\models\bll;

use App\models\dal\Connection;
use App\models\dto\Canal;
use PDO;

class CanalBLL
{
    public static function selectAll()
    {
        $sql = "SELECT id, fk_equipo, nombre FROM canal";
        $conn = new Connection();
        $res = $conn->query($sql);
        $list = [];
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $obj = self::rowToDto($row);
            $list[] = $obj;
        }
        return $list;
    }

    public static function selectById($id)
    {
        $sql = "SELECT id, fk_equipo, nombre FROM canal WHERE id = :p_id";
        $conn = new Connection();
        $res = $conn->queryWithParams($sql, array(
            "p_id" => $id
        ));
        if ($res->rowCount() == 0) {
            return null;
        }
        $row = $res->fetch(PDO::FETCH_ASSOC);
        return self::rowToDto($row);
    }

    public static function selectByEquipoId($fk_equipo)
    {
        $sql = "SELECT id, fk_equipo, nombre FROM canal WHERE fk_equipo = :p_fk_equipo";
        $conn = new Connection();
        $res = $conn->queryWithParams($sql, array(
            "p_fk_equipo" => $fk_equipo
        ));
        if ($res->rowCount() == 0) {
            return null;
        }
        $list = [];
        while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
            $obj = self::rowToDto($row);
            $list[] = $obj;
        }
        return $list;
    }

    public static function insert($fk_equipo, $nombre)
    {
        $sql = "INSERT INTO canal(fk_equipo, nombre) VALUES (:p_fk_equipo, :p_nombre)";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_fk_equipo" => $fk_equipo,
            "p_nombre" => $nombre
        ));
        return $conn->getLastInsertedId();
    }

    public static function update($id, $fk_equipo, $nombre)
    {
        $sql = "UPDATE canal SET fk_equipo = :p_fk_equipo, nombre = :p_nombre WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_fk_equipo" => $fk_equipo,
            "p_nombre" => $nombre,
            "p_id" => $id
        ));
        return true;
    }

    public static function delete($id)
    {
        $sql = "DELETE FROM canal WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_id" => $id
        ));
        return true;
    }

    static function rowToDto($row)
    {
        $obj = new Canal();
        $obj->setId($row["id"]);
        $obj->setFkEquipo($row["fk_equipo"]);
        $obj->setNombre($row["nombre"]);
        return $obj;
    }
}