<?php

namespace App\Exception;

use Throwable;

class EmptyBodyException extends \Exception
{
    public function __construct(string $message = "", int $code = 0, Throwable $previous = null)
    {
        parent::__construct("The body of POST/PUT can't be empty", $code, $previous);
    }
}
