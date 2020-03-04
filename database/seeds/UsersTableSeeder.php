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
        factory(App\User::class, 5000)->create()->each(function ($user) {
            $user->posts()->save(factory(App\Post::class)->make());
        });
    }
}
