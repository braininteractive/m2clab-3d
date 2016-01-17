<?php
//namespace Acme;
//
//use RedBean_Facade as R;
//
//class Shop
//{
//
//    public $name;
//    public $description;
//    public $image;
//
//    static function getShops()
//    {
//        return R::getAll('SELECT name, description, image FROM shops');
//    }
//
//    static function exists($shop)
//    {
//        return R::findOne('shops', 'name = ?', [$shop->name]) !== null;
//    }
//
//}