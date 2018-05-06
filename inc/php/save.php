<?php
require_once 'db.php';
require_once 'dbcon.php';

if(DbH::getDbH()){
    $db = DbH::getDbH();
        
    echo 'Got Db';
}
else{
    echo 'Do not have a Db!';
}

$content = file_get_contents("php://input");
$json = $_POST["data"];

print_r("</br>");
foreach ($obj as $key => $object) {
    
    echo '<div style="float:left; margin: 10px;">';
    print_r($object->name . "</br>");
    print_r("&nbsp&nbsp" . $object->type . "</br>");
    print_r("&nbsp&nbsp" . $object->altitude . "</br>");
    print_r("&nbsp&nbsp" . $object->width . "</br>");
    print_r("&nbsp&nbsp" . $object->depth . "</br>");
    print_r("&nbsp&nbsp" . $object->height . "</br>");
    echo'</div>'; 
}

$sql = 'INSERT INTO kitchens (data) 
                VALUES (:json);';

try {
    $obj_save = json_encode($obj);
    $q = $db->prepare($sql);
    $q->bindValue(':json', $json);
    $q->execute();
    printf("<p>Your registration has been a success. <br/></p>\n");
} catch(PDOException $e) {
    // Throw an error
    printf("<p>Insert of user has failed for the following reason: <br/>%s</p>\n",
        $e->getMessage());
}