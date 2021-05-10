<?php

// Class to establish connection
class Connect
{
    function connectDB()
    {
        $config = include(__DIR__ . '/config.php');
        $conn = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        return $conn;
    }
}