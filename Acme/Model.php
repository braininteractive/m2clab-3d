<?php
namespace Acme;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Validator\Constraints as Assert;
use RedBean_Facade as R;

class Model
{

    public $model;
    public $config;

    static function getModelAttributes($model)
    {
        return R::getAll('SELECT a.name, a.type, ag.name collection, r.initial, r.price, r.max, r.min FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? AND Coalesce(m.deleted, 0) = 0
', [$model]);
    }
    static function getGroups($model)
    {
        return R::getAll('SELECT ag.name collection FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? AND Coalesce(m.deleted, 0) = 0 GROUP BY ag.name ORDER BY ag.id', [$model]);
    }

    static function deleteModel($model)
    {
        return R::exec( 'UPDATE models SET deleted=1 WHERE name = ?', [$model] );
    }

    static function attrExists($attribute)
    {
        return R::findOne('attributes', 'name = ?', [$attribute]);
    }

    static function modelExists($model)
    {
        return R::findOne('models', 'name = ?', [$model]);
    }

    public function createForm(\Silex\Application $app)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('model', 'form', $this);

        $form = $formBuilder
            ->add('model', 'file', array('constraints' => new Assert\NotBlank()))
            ->add('config', 'file', array('constraints' => new Assert\NotBlank()))
            ->getForm();

        return $form;
    }

    public function store($filePath, $data, $shop)
    {
        $object = json_decode($data);

        $shopID = Shop::existsShop($shop)->id;
        if(!self::modelExists($object->name)){
            $model = R::dispense('models');
            $model->name = $object->name;
            $model->url = $filePath;
            $model->shop_id = $shopID;
            $id = R::store($model);

            R::ext('xdispense', function( $type ){
                return R::getRedBean()->dispense( $type );
            });


            foreach($object->attributes as $key => $attribute){
                if(self::attrExists($key)){
                    $rel_model_attr = R::xdispense('rel_model_attr');
                    $rel_model_attr->model_id = $id;
                    $rel_model_attr->attr_id = self::attrExists($key)->id;
                    $rel_model_attr->min = $attribute->range->min;
                    $rel_model_attr->max = $attribute->range->max;
                    $rel_model_attr->initial = $attribute->initial;
                    $rel_model_attr->price = $attribute->price;
                    R::store($rel_model_attr);
                }

            }
        }


    }

}