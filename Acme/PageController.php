<?php

namespace Acme;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;




class PageController
{
    public $shop_name;

    public function showLogin(Request $request, Application $app)
    {
        $form = Shop::createLoginForm($app);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $shop = $form['shop_name']->getData();

            return $app->redirect('/admin/' . $shop);
        }

        return $app['twig']->render('page/login.twig', array(
            "form" => $form->createView()
        ));
    }

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
            $models_attr[$model['name']] = Model::getModelDescription($model['name']);
        }

        $model = new Model(rand(1, 99999));
        $form = $model->createForm($app);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $dir = '/models/' . $shop;
            $file =  $form['model']->getData();
            $extension = 'stl';
            $filename = rand(1, 99999).'.'.$extension;
            $file->move('.' . $dir, $filename);

            $image_dir = '/models/' . $shop;
            $image = $form['image']->getData();
            $image->move('.' . $image_dir, $image->getClientOriginalName());

            $id = $model->store($dir . '/' . $filename, $shop, $image_dir . '/' . $image->getClientOriginalName());
            return $this->showModelConfig($request, $app, $shop, Model::getModelName($id));

        }elseif($form->isSubmitted() && !$form->isValid()){
            var_dump($form->getErrors(true));
            die();
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

    public function showModelConfig(Request $request, Application $app, $shop, $model)
    {
        $mdel = new Model($model);
        $form = $mdel->createConfigForm($app);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            return $app->redirect('/admin/' . $shop);
        }

        return $app['twig']->render('page/config.twig', array(
            "model" => Model::modelExists($model),
            "form" => $form->createView()
        ));
    }


}