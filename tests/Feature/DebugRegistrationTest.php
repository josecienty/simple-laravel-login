<?php

test('debug registration without email', function () {
    $this->withoutExceptionHandling();

    $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => '',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);
});
