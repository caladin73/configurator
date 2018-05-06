<?php
/**
 * Created by PhpStorm.
 * User: Peter_Laptop
 * Date: 21-02-2018
 * Time: 09:26
 */

require_once '..app/DbH.inc.php';
require_once '..app/DbP.inc.php';

class kitchen {
    private $id;
    private $code;
    private $data;

    function getId()
    {
        return this->id;
    }

    function getCode()
    {
        return this->code;
    }

    function getData()
    {
        return this->data;
    }

    public function createKitchen() {

        $dbh = DbH::getDbH();

        try {
            $q = $dbh->prepare("INSERT INTO kitchens (data) values (:data)");
            $q->bindvalue(':data', $_POST['data']);
            $q->execute();
        } catch(PDOException $e) {
            die("Posting failed. Call a friend.<br/>".$e->getMessage());
        }
            echo $q . "<br>" . $e->getMessage();
        }




    public function retriveKitchen() {

        $dbh = DbH::getDbH();
        $sql = "SELECT * FROM kitchens WHERE id='".$_POST['id']."' ";
        $q = $dbh->prepare($sql);
        $q->execute();
        }





}