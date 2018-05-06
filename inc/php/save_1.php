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
/*
header("Content-Type: application/json; charset=UTF-8");
$obj1 = json_decode($_GET["data"], false);
var_dump($obj1);
 */
$json = file_get_contents('../test/test_json.json');
$obj = json_decode($json);

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

$sql = 'INSERT INTO json ( name, json) 
                VALUES ( :name, :json);';

try {
    $obj_save = json_encode($obj);
    $q = $db->prepare($sql);
    $q->bindValue(':name', "test");
    $q->bindValue(':json', $obj_save);
    $q->execute();
    printf("<p>Your registration has been a success. <br/></p>\n");
} catch(PDOException $e) {
    printf("<p>Insert of user has failed for the following reason: <br/>%s</p>\n",
        $e->getMessage());
}

