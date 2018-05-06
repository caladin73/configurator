<?php
require_once 'db.php';
require_once 'dbcon.php'; 
if(DbH::getDbH()){
    $db = DbH::getDbH();
}

$id = $_GET["id"];

$sql = 'SELECT data FROM kitchens WHERE id = :id;';

try {
    $q = $db->prepare($sql);
    $q->bindValue(':id', $id);
    $q->execute();
    $result = $q->fetchAll();
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }else{
    }
    printf($result[0][0]);
} catch(PDOException $e) {
    // Throw an error
    printf("<p>Get of user has failed for the following reason: <br/>%s</p>\n",
        $e->getMessage());
}

