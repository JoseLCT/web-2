<?php

namespace App\models\bll;

use App\models\dal\Connection;
use App\models\dto\Equipo;
use PDO;

class EquipoBLL
{
    public static function selectAll()
    {
        $sql = "SELECT id, nombre, descripcion FROM equipo";
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
        $sql = "SELECT id, nombre, descripcion FROM equipo WHERE id = :p_id";
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

    public static function insert($nombre, $descripcion)
    {
        $sql = "INSERT INTO equipo(nombre, descripcion) VALUES (:p_nombre, :p_descripcion)";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_nombre" => $nombre,
            "p_descripcion" => $descripcion
        ));
        return $conn->getLastInsertedId();
    }

    public static function update($id, $nombre, $descripcion)
    {
        $sql = "UPDATE equipo SET nombre = :p_nombre, descripcion = :p_descripcion WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_nombre" => $nombre,
            "p_descripcion" => $descripcion,
            "p_id" => $id
        ));
        return true;
    }

    public static function delete($id)
    {
        $sql = "DELETE FROM equipo WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_id" => $id
        ));
        return true;
    }

    static function rowToDto($row)
    {
        $obj = new Equipo();
        $obj->setId($row["id"]);
        $obj->setNombre($row["nombre"]);
        $obj->setDescripcion($row["descripcion"]);
        return $obj;
    }
}