<?php

namespace App;

use App\Stock\Product;
use App\Stock\Reserve;
use App\Stock\Size;
use App\Stock\StockAction;
use App\Stock\Type;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Island extends Model
{
    protected $guarded = [];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function startDays()
    {
        return $this->hasMany(StartDay::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function handovers()
    {
        return $this->hasMany(HandOver::class);
    }

    public function dateHandover(string $date)
    {
        $handover = $this->handovers()->whereDate('created_at', $date)->first();
        return $handover->amount ?? 0;
    }

    public function dateBalance(string $date)
    {
        return $this->deals()->whereDate('created_at', $date)->get()
            ->reduce(function ($acc, $deal) {
                return $deal->is_cache ? $acc + $deal->income - $deal->expense : $acc;
            }, $this->startBalance($date));
    }

    public function startBalance(string $date)
    {
        return $this->startDays()->whereDate('created_at', $date)->first()->amount ?? 0;
    }

    public function dateExpenses(string $date)
    {
        return $this->expenses()->whereDate('created_at', $date)->get()
            ->reduce(function ($acc, $item) {
                return $acc + $item->amount;
            }, 0);
    }

    public function makeStartDate()
    {
        $yesterday = Carbon::yesterday()->toDateString();
        return $this->startDays()->create(['amount' => $this->dateBalance($yesterday) - $this->dateExpenses($yesterday) - $this->dateHandover($yesterday)]);
    }

    //Stock

    public function reserves()
    {
        return $this->hasMany(Reserve::class);
    }

    public function dateReserves(string $date)
    {
        return $this->reserves()->whereDate('created_at', $date)->get();
    }

    public function stockActions()
    {
        return $this->hasMany(StockAction::class);
    }

    public function dateStockActions(string $date)
    {
        return $this->stockActions()->whereDate('created_at', $date)->get();
    }

    public function makeReserves()
    {
        $productIds = Product::pluck('id')->all();
        $typeIds = Type::pluck('id')->all();
        $sizeIds = Size::pluck('id')->all();

        $yesterday = Carbon::yesterday()->toDateString();
        $yesterdayReserves = $this->dateReserves($yesterday);
        $yesterdayActions = $this->dateStockActions($yesterday);

        foreach ($productIds as $productId) {
            foreach ($typeIds as $typeId) {
                foreach ($sizeIds as $sizeId) {
                    $prevCount = $yesterdayReserves
                        ->where('product_id', $productId)
                        ->where('type_id', $typeId)
                        ->where('size_id', $sizeId)
                        ->first()
                        ->count ?? 0;
                    $actions = $yesterdayActions
                        ->where('product_id', $productId)
                        ->where('type_id', $typeId)
                        ->where('size_id', $sizeId);
                    $count = $actions->reduce(function ($carry, $action) {
                        return $action->type === 'receipt' ?  $carry + $action->count : $carry - $action->count;
                    }, $prevCount);
                    $this->reserves()->create([
                        'product_id' => $productId,
                        'type_id' => $typeId,
                        'size_id' => $sizeId,
                        'count' => $count
                    ]);
                }
            }
        }
    }
}
