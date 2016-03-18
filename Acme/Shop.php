<?php
namespace Acme;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Validator\Constraints as Assert;
use RedBean_Facade as R;

class Shop
{

    public $name;
    public $description;
    public $image;
    public $shop_name;

    static function getShops($shop)
    {
        return R::getAll('SELECT name, description, image FROM shops');
    }

    static function getShopModels($shop)
    {
        return R::getAll('SELECT name, image, description FROM models WHERE shop_id = (SELECT id FROM shops WHERE name = ?) AND Coalesce(deleted, 0) = 0', [$shop]);
    }


    static function existsShop($shop)
    {
        return R::findOne('shops', 'name = ?', [$shop]);
    }

    public function createLoginForm(\Silex\Application $app)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('login', 'form', $this);
        $form = $formBuilder
            ->add('shop_name', 'text', array('constraints' => new Assert\NotBlank()))
            ->getForm();
        return $form;
    }



}