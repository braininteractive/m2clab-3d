<?php
namespace Acme;

use RedBean_Facade as R;

class Model
{

    static function getModelAttributes($model)
    {
        return R::getAll('SELECT a.name, a.type, r.initial, r.price, r.max, r.min FROM models m LEFT JOIN rel_model_attr r ON m.id = r.model_id RIGHT JOIN attributes a ON a.id = r.attr_id WHERE m.name = ?', [$model]);
    }

}