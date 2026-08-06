<?php

test('the home route redirects to the dashboard', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('dashboard'));
});
