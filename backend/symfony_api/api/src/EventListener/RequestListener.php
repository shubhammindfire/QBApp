<?php

namespace App\EventListener;

use Exception;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class RequestListener
{
    /**
     * @var JWTEncoderInterface $jwtEncoder
     */
    private $jwtEncoder;

    public function __construct(JWTEncoderInterface $jwtEncoder)
    {
        $this->jwtEncoder = $jwtEncoder;
    }

    public function __invoke(RequestEvent $event): void
    {

        $request = $event->getRequest();
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
