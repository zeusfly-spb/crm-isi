<?php

use Illuminate\Database\Seeder;
use App\Stock\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */


    private $protos = [
        ['name' => 'Стельки', 'description' => null],
        ['name' => 'Полустельки', 'description' => null],
        ['name' => 'Подпяточник', 'description' => 'good'],
        ['name' => 'Вальгусные распорки', 'description' => 'good']
    ];

    public function run()
    {
        echo PHP_EOL;
        foreach ($this->protos as $proto) {
            if (!Product::where('name', $proto['name'])->first()) {
                Product::create(['name' => $proto['name'], 'description' => $proto['description']]);
                echo "Product " . $proto['name'] . " created" . PHP_EOL;
            } else {
                echo "Product " . $proto['name'] . " already exists" . PHP_EOL;
            }
        }
    }
}
