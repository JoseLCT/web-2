<?php

namespace App\models\dto;

class Canal
{
    public $id;
    public $fk_equipo;
    public $nombre;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getFkEquipo()
    {
        return $this->fk_equipo;
    }

    /**
     * @param mixed $fk_equipo
     */
    public function setFkEquipo($fk_equipo)
    {
        $this->fk_equipo = $fk_equipo;
    }

    /**
     * @return mixed
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * @param mixed $nombre
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }
}