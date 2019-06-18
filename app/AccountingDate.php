<?php

namespace App;

use Carbon\Carbon;

class AccountingDate
{
    private static $session_key = 'accounting_date';

    /**
     * @return Carbon
     */
    public static function get()
    {
        $date = \session(self::$session_key, \now());

        return clone $date;
    }

    /**
     * Set specific day if not null, current otherwise.
     *
     * @param Carbon|null $date
     *
     * @return Carbon|\Illuminate\Support\Carbon
     */
    public static function set(Carbon $date = null)
    {
        if (null === $date) {
            $date = \now();
        }
        \session([
            self::$session_key => $date,
        ]);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function prevDay()
    {
        $date = self::get();
        $date = $date->subDay(1);
        self::set($date);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function nextDay()
    {
        $date = self::get();
        $date = $date->addDay(1);
        self::set($date);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function prevMonth()
    {
        $date = self::get();
        $date = $date->subMonthsNoOverflow(1);
        self::set($date);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function nextMonth()
    {
        $date = self::get();
        $date = $date->addMonthsNoOverflow(1);
        self::set($date);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function prevYear()
    {
        $date = self::get();
        $date = $date->subYearNoOverflow(1);
        self::set($date);

        return $date;
    }

    /**
     * @return Carbon
     */
    public static function nextYear()
    {
        $date = self::get();
        $date = $date->addYearNoOverflow(1);
        self::set($date);

        return $date;
    }
}
