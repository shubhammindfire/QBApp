<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Exception\EmptyBodyException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ViewEvent;

class EmptyRequestBodySubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        return [KernelEvents::REQUEST => ['handleEmptyRequestBody', EventPriorities::POST_DESERIALIZE]];
        // return [KernelEvents::VIEW => ['handleEmptyRequestBody', EventPriorities::PRE_VALIDATE]];
    }

    public function handleEmptyRequestBody(RequestEvent $event)
    // public function handleEmptyRequestBody(ViewEvent $event)
    {
        $method = $event->getRequest()->getMethod();

        // if the method is not post/put then do nothing
        if (!in_array($method, [Request::METHOD_POST, Request::METHOD_PUT])) {
            return;
        }

        $data = $event->getRequest()->get('data');

        if ($data === null) {
            // TODO: Figure this out, currently this gives 500 Internal Server Error even after exception_to_status added in api_platform.yaml
            throw new EmptyBodyException();
            // return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }
    }
}
