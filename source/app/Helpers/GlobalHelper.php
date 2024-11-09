<?php

namespace App\Helpers;

class GlobalHelper
{
    public static function convertStringToAsterisksmod2($kata) {
        $result = "";
        for ($i = 0; $i < strlen($kata); $i++) {
            $result .= ($i % 2 == 0) ? '*' : $kata[$i];
        }
        return $result;
    }
}