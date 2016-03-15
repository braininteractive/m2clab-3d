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
    public $name;
    public $id;
    public $model;

    function __construct($mdel) {
        if($mdel){
            $this->name = $mdel;
            $this->id = $this->getModelId($mdel);
        }
        R::ext('xdispense', function( $type ){
            return R::getRedBean()->dispense( $type );
        });
    }

    public function getTitle(){
        return $this->name;
    }
    public function setTitle($title){
        $mdl = R::findOne('models','id = ?', [$this->id] );
        $mdl->name = $title;
        R::store($mdl);
    }
    public function getMinWidth(){
        return $this->getModelAttribute($this->name, 'width', 'min');
    }
    public function setMinWidth($minWidth)
    {
        $this->setModelAttribute($this->id, 'width', 'min', $minWidth);
    }
    public function getMaxWidth(){
        return $this->getModelAttribute($this->name, 'width', 'max');
    }
    public function setMaxWidth($maxWidth)
    {
        $this->setModelAttribute($this->id, 'width', 'max', $maxWidth);
    }
    public function getMinHeight(){
        return $this->getModelAttribute($this->name, 'height', 'min');
    }
    public function setMinHeight($minHeight)
    {
        $this->setModelAttribute($this->id, 'height', 'min', $minHeight);
    }
    public function getMaxHeight(){
        return $this->getModelAttribute($this->name, 'height', 'max');
    }
    public function setMaxHeight($maxHeight)
    {
        $this->setModelAttribute($this->id, 'height', 'max', $maxHeight);
    }
    public function getMinDepth(){
        return $this->getModelAttribute($this->name, 'depth', 'min');
    }
    public function setMinDepth($minDepth)
    {
        $this->setModelAttribute($this->id, 'depth', 'min', $minDepth);
    }
    public function getMaxDepth(){
        return $this->getModelAttribute($this->name, 'depth', 'max');
    }
    public function setMaxDepth($maxDepth)
    {
        $this->setModelAttribute($this->id, 'depth', 'max', $maxDepth);
    }
    public function getForms(){
        return array(
            'square' => true,
            'circle' => false
        );
    }
    public function setForms($forms){

    }

    static function getModelAttributes($model)
    {
        return R::getAll('SELECT a.name, a.type, ag.name collection, r.initial, r.price, r.max, r.min FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? AND Coalesce(m.deleted, 0) = 0', [$model]);
    }
    static function setModelAttribute($model, $attribute, $type, $set)
    {
        $attr_id = R::getAll('SELECT id FROM attributes WHERE name = ?', [$attribute])[0]['id'];
        $attr = R::findOne('rel_model_attr','model_id = ? AND attr_id = ?', [$model, $attr_id] );
        if($attr){
            $attr->$type = $set;
            R::store($attr);
        }else{
            $attr = R::xdispense('rel_model_attr');
            $attr->$type = $set;
            R::store($attr);
        }
    }
    static function getModelAttribute($model, $attribute, $type)
    {
        return R::getAll('SELECT '. $type .' FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id  WHERE m.name = ? AND a.name = ?', [$model, $attribute])[0][$type];
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
        return R::findOne('models', 'name = ? OR id = ?', [$model, $model]);
    }
    static function getModelId($model)
    {
        return R::getAll('SELECT id FROM models WHERE name = ?', [$model])[0]['id'];
    }

    public function createForm(\Silex\Application $app)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('model', 'form', $this);
        $form = $formBuilder
            ->add('model', 'file', array('constraints' => new Assert\NotBlank()))
            ->getForm();
        return $form;
    }

    public function createConfigForm(\Silex\Application $app, $model)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('config', 'form', $this);
        $form = $formBuilder
            ->add('title', 'text', array('constraints' => new Assert\NotBlank()))
            ->add('minWidth', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('maxWidth', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('minHeight', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('maxHeight', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('minDepth', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('maxDepth', 'number', array('constraints' => new Assert\Blank(),'required' => false))
            ->add('forms', 'choice', array(
                'constraints' => new Assert\Blank(),
                'multiple' => true,
                'expanded' => true,
                'choices' => $this->getForms()
            ))
            ->getForm();
        return $form;
    }

    public function store($filePath, $shop)
    {
        $shopID = Shop::existsShop($shop)->id;
        $model = R::dispense('models');
        $model->name = $this->name;
        $model->url = $filePath;
        $model->shop_id = $shopID;
        return $id = R::store($model);
    }

}