<?php

use App\Insole;
use Illuminate\Database\Seeder;

class InsolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $materials = [
            'Обычные',
            'Колоф',
            'Флис',
        ];
        $types = [
            'Обычные' => [
                '29-30',
                '30-31.5',
                '32-33',
                '34-34.5',
                '35-36',
                '37-37.5',
                '38-39',
                '40-40.5',
                '41-42',
                '43-43.5',
                '44-45',
                '46-46.5',
                '47',
            ],
            'Полустельки' => [
                '35-36',
                '37-37.5',
                '38-39',
                '40-40.5',
                '41-42',
                '43-43.5',
                '44-45',
            ],
            'Детские' => [
                '29-30',
                '30-31.5',
                '32-33',
                '34-34.5',
                '35-36',
            ],
        ];

        foreach ($materials as $material) {
            foreach ($types as $type => $sizes) {
                foreach ($sizes as $size) {
                    Insole::query()->forceCreate([
                        'type'     => $type,
                        'size'     => $size,
                        'material' => $material,
                    ]);
                }
            }
        }
    }
}
