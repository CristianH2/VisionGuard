namespace App\Http\Middleware;

use Closure;
use Asm89\Stack\CorsService;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        $cors = new CorsService([
            'allowedOrigins' => ['*'], // Cambia según tus necesidades
            'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'allowedHeaders' => ['Content-Type', 'Authorization'],
        ]);

        $response = $next($request);

        return $cors->addHeaders($response, $request);
    }
}

