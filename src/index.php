<?php

require_once __DIR__ . '/../.env.config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Silex\Application;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

$app = new Application();

$env = getenv('APP_ENV') ? : 'prod';
define('APP_ENV', $env);

$app->register(new Silex\Provider\HttpCacheServiceProvider(), [
   'http_cache.cache_dir' => __DIR__ . '/http_cache/'
]);

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/logging.log',
));

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path'    => __DIR__ . '/views',
    'twig.options' => array(
        'debug'                => $app['debug'],
        'strict_variables'      => false,
        'cache'                => __DIR__ . '/twig_cache/',
        'auto_reload'          => $app['debug']
    )
));

$app['twig']->addExtension(new Twig_Extension_Debug());


$addCacheMiddleware = function (Request $request, Response $response, Application $app) {
    return $response->setCache(['s_maxage' => 3600]);
};

// prepare structure for current request site
$app->before(function ($request, $app)
{

});


// ------ ROUTING ------

// remove favicon spam
$app->get('/favicon.ico', function() use ($app) { return true; });


$app->get('/', function() use ($app) {
    return $app['twig']->render('page/homepage.twig');
});

// -------- ERROR HANDLING -------

$app->error(function (\Exception $e, $code) use ($app)
{
    switch ($code)
    {
        case 404:
            $message = 'The requested page could not be found.';
            break;
        default:
            $message = 'Something went wrong.';
    }

    // if ($app['debug']) {
        echo "<pre>";
        echo $e;
        echo "</pre>";
    // } else {
        $app['logger']->addError(sprintf("%s: %s: %d", $code, $message, $e));
        // return $app['twig']->render('layouts/404.twig', ['code' => $code, 'message' => $message]);
    // }

});



// ------- APP START -------
if ($app['debug']) {
    $app->run();
} else {
    $app['http_cache']->run();
}
