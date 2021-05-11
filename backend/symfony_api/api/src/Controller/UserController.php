<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/user")
 */
class UserController extends AbstractController
{

    /**
     * @Route("/", name="user_list", methods={"GET"})
     * @param SerializerInterface $serializer
     */
    public function list(SerializerInterface $serializer)
    {
        $repository = $this->getDoctrine()->getRepository(User::class);
        $items = $repository->findAll();

        // echo ("items = " . $items[0]->getUsername());
        // echo (json_encode($items[0]->getPassword()));

        // return $this->json(
        //     [
        //         'page' => $page,
        //         'data' => $items,
        //     ]
        // );


        $serializer = $this->get('serializer');

        // $encoders = [new XmlEncoder(), new JsonEncoder()];
        // $normalizers = [new ObjectNormalizer()];

        // $serializer = new Serializer($normalizers, $encoders);


        // $jsonContent = $serializer->serialize($items, 'json');


        return $this->json(
            [
                "data" => $serializer->serialize($items, 'json')
            ]
        );
    }
}
