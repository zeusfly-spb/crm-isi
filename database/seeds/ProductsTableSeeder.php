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
    private $names = [
        'Стельки',
        'Полустельки'
    ];

    public function run()
    {
        echo PHP_EOL;
        foreach ($this->names as $name) {
            if (!Product::where('name', $name)->first()) {
                Product::create(['name' => $name]);
                echo "Product $name created" . PHP_EOL;
            } else {
                echo "Product $name already exists" . PHP_EOL;
            }
        }
    }
}
