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
    public $shop_name;

    public $image;
    public $title_image;

    public function getImage()
    {
        return $this->image;
    }

    public function setImage($image, $shop)
    {

        $shopID = self::existsShop($shop)->getID();
        $shopBean = R::load('shops',$shopID);
        $shopBean->image = $image;
        R::store($shopBean);
        $this->image = $image;
        return $this;
    }

    public function getTitleImage()
    {
        return $this->title_image;
    }

    public function setTitleImage($image, $shop)
    {

        $shopID = self::existsShop($shop)->getID();
        $shopBean = R::load('shops',$shopID);
        $shopBean->title_image = $image;
        R::store($shopBean);
        $this->title_image = $image;
        return $this;
    }

    public function getSavedImage($shop){
        $shopID = self::existsShop($shop)->getID();
        return R::load('shops',$shopID)->image;
    }

    public function getSavedTitleImage($shop){
        $shopID = self::existsShop($shop)->getID();
        return R::load('shops',$shopID)->title_image;
    }

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

    public function createForm(\Silex\Application $app)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('shop', 'form', $this);
        $form = $formBuilder
            ->add('image', 'file', array('required' => false))
            ->add('title_image', 'file', array('required' => false))
            ->getForm();
        return $form;
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