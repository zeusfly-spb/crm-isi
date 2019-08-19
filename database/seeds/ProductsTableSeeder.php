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
        ['name' => 'Стельки', 'description' => null, 'price' => null],
        ['name' => 'Полустельки', 'description' => null, 'price' => null],
        ['name' => 'Подпяточник', 'description' => 'good', 'price' => 300],
        ['name' => 'Вальгусные распорки', 'description' => 'good', 'price' => 250]
    ];

    public function run()
    {
        echo PHP_EOL;
        foreach ($this->protos as $proto) {
            if (!Product::where('name', $proto['name'])->first()) {
                Product::create(['name' => $proto['name'], 'description' => $proto['description'], 'price' => $proto['price']]);
                echo "Product " . $proto['name'] . " created" . PHP_EOL;
            } else {
                $product = Product::where('name', $proto['name'])->first();
                $product->update([
                    'description' => $proto['description'],
                    'price' => $proto['price']
                ]);
                echo "Product " . $proto['name'] . " already exists & was updated" . PHP_EOL;
            }
        }
    }
}
