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
        $modelGroups = Model::getGroups($model);
        return $app['twig']->render('page/model.twig', array(
            "modelAttr" => $modelAttr,
            "model" => Model::modelExists($model),
            "groups" => $modelGroups
        ));
    }

    public function showAdmin(Request $request, Application $app, $shop)
    {

        $models_attr = array();
        $models = Shop::getShopModels($shop);
        foreach ($models as $model) {
            $models_attr[$model['name']] = Model::getModelAttributes($model['name']);
        }

        $model = new Model(rand(1, 99999));
        $form = $model->createForm($app);

        $form->handleRequest($request);

        if ($form->isValid()) {
            $dir = '/models/' . $shop;
            $file =  $form['model']->getData();
            $extension = 'stl';
            $filename = rand(1, 99999).'.'.$extension;
            $file->move('.' . $dir, $filename);

            $id = $model->store($dir . '/' . $filename, $shop);
            $configForm = $model->createConfigForm($app);
            return $app['twig']->render('page/config.twig', array(
                "model" =>  Model::modelExists($id),
                "form" => $configForm->createView()
            ));
        }

        return $app['twig']->render('page/admin.twig', array(
            "shop" => $shop,
            "models" => $models_attr,
            "form" => $form->createView()
        ));
    }

    public function deleteModel(Request $request, Application $app, $shop, $model){
        Model::deleteModel($model);
        return $this->showAdmin($request, $app, $shop);
    }

    public function showModelConfig(Request $request, Application $app, $model)
    {
        $mdel = new Model($model);
        $form = $mdel->createConfigForm($app);
        $form->handleRequest($request);

        if ($form->isValid()) {
        }

        return $app['twig']->render('page/config.twig', array(
            "model" => Model::modelExists($model),
            "form" => $form->createView()
        ));
    }


}