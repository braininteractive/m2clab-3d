<?php
namespace Acme;

use RedBean_Facade as R;

class Shop
{

    public $name;
    public $description;
    public $image;

    static function getShops($shop)
    {
        return R::getAll('SELECT name, description, image FROM shops');
    }

    static function getShopModels($shop)
    {
        return R::getAll('SELECT name FROM models WHERE shop_id = (SELECT id FROM shops WHERE name = ?)', [$shop]);
    }


    static function exists($shop)
    {
        return R::findOne('shops', 'name = ?', [$shop->name]) !== null;
    }

}