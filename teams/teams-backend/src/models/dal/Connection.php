<?php

namespace App\models\dal;

use PDO;

class Connection
{
    private $connection;

    function getConnection()
    {
        global $username, $password, $hostname, $port, $dbname;
        if ($this->connection == null) {
            $this->connection = new PDO("mysql:host=$hostname;port=$port;dbname=$dbname;charset=utf8", $username, $password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        return $this->connection;
    }

    function query($csql)
    {
        return $this->getConnection()->query($csql);
    }

    function queryWithParams($csql, $paramArray = [])
    {
        $q = $this->getConnection()->prepare($csql);
        $q->execute($paramArray);
        return $q;
    }

    function getLastInsertedId()
    {
        return $this->getConnection()->lastInsertId();
    }
}