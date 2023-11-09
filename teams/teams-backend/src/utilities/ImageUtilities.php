<?php

namespace App\utilities;
class ImageUtilities
{
    public static function saveImage($nombreInput, $id, $directorioDestino, $extension)
    {
        $tempArchivo = $_FILES[$nombreInput]["tmp_name"];
        $errorArchivo = $_FILES[$nombreInput]["error"];

        if ($errorArchivo === UPLOAD_ERR_OK) {
            $rutaCompleta = $directorioDestino . $id . "." . $extension;

            // Mover el archivo cargado a su ubicación final
            if (!move_uploaded_file($tempArchivo, $rutaCompleta)) {
                $_SESSION["error"] = "Hubo un error al subir la imagen.";
            }

        } else {
            $_SESSION["error"] = "Hubo un error al subir la imagen.";
            $_SESSION["debugError"] = "Error en la carga de la imagen: " . $errorArchivo;
        }
    }
}