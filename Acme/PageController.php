<?php

namespace Acme;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class PageController
{
    public function showShops(Request $request, Application $app)
    {
        $shops = Shop::getShops();
        return $app['twig']->render('page/homepage.twig', array(
            "shops" => $shops
        ));
    }

    public function showShopModels(Request $request, Application $app, $shop)
    {
        $models = Shop::getShopModels($shop);
        return $app['twig']->render('page/shop.twig', array(
            "shop" => $shop,
            "models" => $models
        ));
    }

    public function showModel(Request $request, Application $app, $model)
    {
        $modelAttr = Model::getModelAttributes($model);
        return $app['twig']->render('page/model.twig', array(
            "modelAttr" => $modelAttr,
            "model" => $model
        ));
    }
}