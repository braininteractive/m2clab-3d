<?php
namespace Acme;

use RedBean_Facade as R;

class Model
{

    static function getModelAttributes($model)
    {
        return R::getAll('SELECT a.name, a.type, ag.name collection, r.initial, r.price, r.max, r.min FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ?', [$model]);
    }
    static function getGroups($model)
    {
        return R::getAll('SELECT ag.name collection FROM models m INNER JOIN rel_model_attr r ON m.id = r.model_id INNER JOIN attributes a ON a.id = r.attr_id INNER JOIN attr_groups ag ON ag.id = a.group_id WHERE m.name = ? GROUP BY ag.name ORDER BY ag.id', [$model]);
    }

}