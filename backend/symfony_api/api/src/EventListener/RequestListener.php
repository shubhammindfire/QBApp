<?php

namespace App\EventListener;

use Exception;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class RequestListener
{
    /**
     * @var JWTEncoderInterface $jwtEncoder
     */
    private $jwtEncoder;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    public function __construct(JWTEncoderInterface $jwtEncoder, LoggerInterface $logger)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->logger = $logger;
    }

    public function __invoke(RequestEvent $event): void
    {

        $request = $event->getRequest();
        // $data = $request->get("data");

        // echo("request body = $data");
        // $request->attributes->set("request_body", $data);

        // $method = $request->getMethod();
        // $realMethod = $request->getRealMethod();
        // echo ("method = $method and real method = $realMethod");

        // if (in_array($method, [Request::METHOD_POST, Request::METHOD_PUT]) && $request->get('data') === null) {
        //     // $this->logger->error("Method PUT/POST with an empty body");
        //     $this->logger->info("Method PUT/POST with an empty body");
        //     return new Response(null, Response::HTTP_BAD_REQUEST);
        // } else {
        //     $this->decodeJWT($request);
        // }
        $this->decodeJWT($request);
    }

    /**
     * @param Request $request
     * this method accepts a request and decodes the JWT from the request, if present
     */
    public function decodeJWT(Request $request)
    {
        try {
            $headers = $request->headers;
            $token = explode(" ", $headers->get("authorization"))[1];
            $decodedToken = $this->jwtEncoder->decode($token);
            $username = $decodedToken['username'];
            if ($username !== null)
                $request->attributes->set("username", $username);
        } catch (Exception $ex) {
        }
    }
}
