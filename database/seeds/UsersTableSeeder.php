<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
<<<<<<< HEAD
        factory(App\User::class, 50000)->create()->each(function ($user) {
=======
        factory(App\User::class, 5000)->create()->each(function ($user) {
>>>>>>> modemb/dev
            $user->posts()->save(factory(App\Post::class)->make());
        });
    }
}
