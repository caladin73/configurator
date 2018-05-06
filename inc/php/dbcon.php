<?php
class DbH extends db {
    private static $dbh;

    private function __construct() {}

    public static function getDbH() {
        if (empty(self::$dbh)) {
            try {
                self::$dbh = new PDO('mysql:host='.db::DBHOST.';dbname='.db::DB, db::DBUSER, db::USERPWD);
                self::$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die(sprintf("<p>Connect failed for following reason: <br/>%s</p>\n",
                  $e->getMessage()));
            }
        }         
        return self::$dbh;
    }
}
