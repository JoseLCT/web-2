<?php

namespace App\models\bll;

use App\models\dal\Connection;
use App\models\dto\Mensaje;
use PDO;

class MensajeBLL
{
    public static function selectAll()
    {
        $sql = "SELECT id, fk_canal, nombre_usuario, titulo, contenido, tipo FROM mensaje";
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
        $sql = "SELECT id, fk_canal, nombre_usuario, titulo, contenido, tipo FROM mensaje WHERE id = :p_id";
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

    public static function selectByCanalId($fk_canal)
    {
        $sql = "SELECT id, fk_canal, nombre_usuario, titulo, contenido, tipo FROM mensaje WHERE fk_canal = :p_fk_canal";
        $conn = new Connection();
        $res = $conn->queryWithParams($sql, array(
            "p_fk_canal" => $fk_canal
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

    public static function insert($fk_canal, $nombre_usuario, $titulo, $contenido, $tipo)
    {
        $sql = "INSERT INTO mensaje(fk_canal, nombre_usuario, titulo, contenido, tipo) VALUES (:p_fk_canal, :p_nombre_usuario, :p_titulo, :p_contenido, :p_tipo)";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_fk_canal" => $fk_canal,
            "p_nombre_usuario" => $nombre_usuario,
            "p_titulo" => $titulo,
            "p_contenido" => $contenido,
            "p_tipo" => $tipo
        ));
        return $conn->getLastInsertedId();
    }

    public static function update($id, $fk_canal, $nombre_usuario, $titulo, $contenido, $tipo)
    {
        $sql = "UPDATE mensaje SET fk_canal = :p_fk_canal, nombre_usuario = :p_nombre_usuario, titulo = :p_titulo, contenido = :p_contenido, tipo = :p_tipo WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_fk_canal" => $fk_canal,
            "p_nombre_usuario" => $nombre_usuario,
            "p_titulo" => $titulo,
            "p_contenido" => $contenido,
            "p_tipo" => $tipo,
            "p_id" => $id
        ));
        return true;
    }

    public static function delete($id)
    {
        $sql = "DELETE FROM mensaje WHERE id = :p_id";
        $conn = new Connection();
        $conn->queryWithParams($sql, array(
            "p_id" => $id
        ));
        return true;
    }

    static function rowToDto($row)
    {
        $obj = new Mensaje();
        $obj->setId($row["id"]);
        $obj->setFkCanal($row["fk_canal"]);
        $obj->setNombreUsuario($row["nombre_usuario"]);
        $obj->setTitulo($row["titulo"]);
        $obj->setContenido($row["contenido"]);
        $obj->setTipo($row["tipo"]);
        return $obj;
    }
}