<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInsolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('insoles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('type');
            $table->string('size');
            $table->string('material');
            $table->timestamps();

            $table->unique(['type', 'size', 'material']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('insoles');
    }
}
