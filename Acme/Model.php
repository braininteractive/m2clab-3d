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
    public $faces;
    public $image;

    function __construct($mdel) {
        if($mdel){
            $this->id = $mdel;
            $this->name = $this->getModelName($mdel);
        }
        R::ext('xdispense', function( $type ){
            return R::getRedBean()->dispense( $type );
        });
    }

    public function getTitle(){
        return $this->name;
    }
    public function setTitle($title){
      $mdl = R::load('models',$this->id);
      $mdl->name = $title;
      R::store($mdl);
    }
    public function getDescription(){
        return $this->getModelDescription($this->name);
    }
    public function setDescription($description){
        $mdl = R::load('models',$this->id);
        $mdl->description = $description;
        R::store($mdl);
    }

    static function getModelAttributes($model)
    {
        return R::getAll('SELECT a.name, a.type, ag.name collection, r.initial, r.price, r.max, r.min FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? AND Coalesce(m.deleted, 0) = 0', [$model]);
    }
    private function setModelAttribute($model, $attribute, $type = null, $set = null)
    {
        $attr_id = R::getAll('SELECT id FROM attributes WHERE name = ? OR id = ?', [$attribute, $attribute])[0]['id'];
        $attr = R::findOne('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, $attr_id] );
        if($attr && $type){
            $attr->$type = $set;
            R::store($attr);
        }elseif($attr) {

        }else
        {
            $attr = R::xdispense('rel_model_attr');
            $attr->model_id = $this->id;
            $attr->attr_id = $attr_id;
            if($type){
                $attr->$type = $set;
            }
            R::store($attr);
        }
    }
    static function getModelAttribute($model, $attribute, $type)
    {
        if ($type){
            return R::getRow('SELECT '. $type .' FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id  WHERE m.name = ? AND a.name = ?', [$model, $attribute])[$type];
        }else{
            $attr_id = self::attrExists($attribute)->id;
            $model_id = self::modelExists($model)->id;
            return R::findOne('rel_model_attr', 'attr_id = ? AND model_id = ?', [$attr_id, $model_id]);
        }
    }

    public function getMinWidth(){ return $this->getModelAttribute($this->name, 'width', 'min');}
    public function setMinWidth($minWidth){$this->setModelAttribute($this->name, 'width', 'min', $minWidth);}

    public function getMaxWidth(){return $this->getModelAttribute($this->name, 'width', 'max');}
    public function setMaxWidth($maxWidth){$this->setModelAttribute($this->name, 'width', 'max', $maxWidth);}

    public function getMinHeight(){return $this->getModelAttribute($this->name, 'height', 'min');}
    public function setMinHeight($minHeight){$this->setModelAttribute($this->name, 'height', 'min', $minHeight);}

    public function getMaxHeight(){return $this->getModelAttribute($this->name, 'height', 'max');}
    public function setMaxHeight($maxHeight){$this->setModelAttribute($this->name, 'height', 'max', $maxHeight);}

    public function getMinDepth(){return $this->getModelAttribute($this->name, 'depth', 'min');}
    public function setMinDepth($minDepth){$this->setModelAttribute($this->name, 'depth', 'min', $minDepth);}

    public function getMaxDepth(){return $this->getModelAttribute($this->name, 'depth', 'max');}
    public function setMaxDepth($maxDepth){$this->setModelAttribute($this->name, 'depth', 'max', $maxDepth);}

    public function getFaces(){return $this->getModelAttribute($this->name, 'faces', 'initial');}
    public function setFaces($faces){$this->setModelAttribute($this->name, 'faces', 'initial', $faces);}

    public function getEmbedding(){return !empty($this->getModelAttribute($this->name, 'text', 'attr_id'));}
    public function setEmbedding($selection){
        if ($selection){
            $this->setModelAttribute($this->id, 'text');
        } else {
            $item = R::findAll('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, 5] );
            R::trashAll($item);
        }
    }
    public function getForms(){
        $all_forms =  R::getAll('SELECT id, name FROM attributes WHERE group_id = 4', []);
        $array = array();
        foreach ($all_forms as $form){
            $array[$form['id']] = $form['name'];
        }
        return $array;
    }
    public function getColors(){
        $all_colors =  R::getAll('SELECT id, name FROM attributes WHERE group_id = 3', []);
        $array = array();
        foreach ($all_colors as $color){
            $array[$color['id']] = $color['name'];
        }
        return $array;
    }
    public function getFormsData($attr){
        $array = array();
        foreach($attr as $key => $value){
            if (R::findOne('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, $key] )){
                $array[] = $key;
            }
        }
        return $array;
    }
    public function getColorsData($attr){
        $array = array();
        foreach($attr as $key => $value){
            if (R::findOne('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, $key] )){
                $array[] = $key;
            }
        }
        return $array;
    }
    public function setForms($selected){
        $all_forms = $this->getForms();
        $array = $this->getFormsData($all_forms);
        foreach($all_forms as $key => $value){
            if (in_array($key, $selected) && !in_array($key, $array)){
                $this->setModelAttribute($this->id,$key);
            }elseif(in_array($key, $array) && !in_array($key, $selected)){
                $item = R::findAll('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, $key] );
                R::trashAll($item);
            }
        }
    }
    public function setColors($selected){
        $all_colors = $this->getColors();
        $array = $this->getColorsData($all_colors);
        foreach($all_colors as $key => $value){
            if (in_array($key, $selected) && !in_array($key, $array)){
                $this->setModelAttribute($this->id,$key);
            }elseif(in_array($key, $array) && !in_array($key, $selected)){
                $item = R::findAll('rel_model_attr','model_id = ? AND attr_id = ?', [$this->id, $key] );
                R::trashAll($item);
            }
        }
    }

    static function getModelName($model)
    {
        $temp = R::findOne('models', 'id = ?', [$model]);
        if(isset($temp)){
          return $temp->name;
        }
    }



    static function getGroups($model)
    {
        return R::getAll('SELECT ag.name collection FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? AND Coalesce(m.deleted, 0) = 0 GROUP BY ag.name ORDER BY ag.id', [$model]);
    }

    static function getModelDescription($model)
    {
      $temp = R::findOne('models', 'name = ? OR id = ?', [$model, $model]);
      if(isset($temp)){
        return $temp->description;
      }
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
        $temp = R::findOne('models', 'name = ?', [$model]);
        if(isset($temp)){
          return $temp->id;
        }
    }

    public function createForm(\Silex\Application $app)
    {
        $formBuilder = $app['form.factory']->createNamedBuilder('model', 'form', $this);
        $form = $formBuilder
            ->add('model', 'file', array('constraints' => new Assert\NotBlank()))
            ->add('image', 'file', array())
            ->getForm();
        return $form;
    }


    public function createConfigForm(\Silex\Application $app)
    {
        $choices = $this->getForms();
        $colors = $this->getColors();
        $formBuilder = $app['form.factory']->createNamedBuilder('config', 'form', $this);
        $form = $formBuilder
            ->add('title', 'text', array('constraints' => new Assert\NotBlank()))
            ->add('description', 'textarea', array())
            ->add('minWidth', 'number', array('required' => false))
            ->add('maxWidth', 'number', array('required' => false))
            ->add('minHeight', 'number', array('required' => false))
            ->add('maxHeight', 'number', array('required' => false))
            ->add('minDepth', 'number', array('required' => false))
            ->add('maxDepth', 'number', array('required' => false))
            ->add('embedding', 'checkbox', array('required' => false))
            ->add('faces', 'textarea', array('required' => false))
            ->add('colors', 'choice', array(
                'multiple' => true,
                'expanded' => true,
                'choices' => $colors,
                'data' => $this->getColorsData($colors)
            ))
            ->add('forms', 'choice', array(
                'multiple' => true,
                'expanded' => true,
                'choices' => $choices,
                'data' => $this->getFormsData($choices)
            ))
            ->getForm();
        return $form;
    }

    public function store($filePath, $shop, $imagePath)
    {
        $shopID = Shop::existsShop($shop)->id;
        $model = R::dispense('models');
        $model->name = 'new';
        $model->url = $filePath;
        $model->shop_id = $shopID;
        $model->image = $imagePath;
        return $id = R::store($model);
    }

}
