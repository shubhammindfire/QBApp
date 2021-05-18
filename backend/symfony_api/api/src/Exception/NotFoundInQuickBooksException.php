<?php

namespace App\Exception;

use Throwable;

class NotFoundInQuickBooksException extends \Exception
{
    public function __construct(string $message = "", int $code = 0, Throwable $previous = null)
    {
        parent::__construct("Provided search entity was not found on the QuickBooks account", $code, $previous);
    }
}
