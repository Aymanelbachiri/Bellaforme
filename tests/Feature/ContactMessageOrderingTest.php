<?php

/**
 * Property 13: Contact messages ordered by creation date
 *
 * For any set of contact messages with different creation timestamps,
 * the admin list endpoint should return them ordered by created_at
 * descending (newest first).
 *
 * Validates: Requirements 8.5
 *
 * @group Feature: product-showcase
 * @group Property 13: Contact messages ordered by creation date
 */

use App\Models\ContactMessage;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

const PROPERTY13_ITERATIONS = 100;

/**
 * Generate a random set of contact messages with distinct created_at timestamps.
 * Messages are inserted in random order to ensure the test validates ordering, not insertion order.
 *
 * @return array<int> Expected IDs in descending created_at order
 */
function generateRandomContactMessages(): array
{
    $count = random_int(2, 10);
    $baseTime = Carbon::now()->subDays(random_int(1, 365));
    $timestamps = [];

    // Generate distinct timestamps spread across a random range
    for ($i = 0; $i < $count; $i++) {
        $timestamps[] = $baseTime->copy()->addMinutes(random_int(1, 100000) + ($i * 100001));
    }

    // Shuffle so insertion order is random (not sorted by time)
    shuffle($timestamps);

    $messages = collect();
    foreach ($timestamps as $ts) {
        $messages->push(ContactMessage::create([
            'name' => 'Test User ' . random_int(1, 99999),
            'email' => 'test' . random_int(1, 99999) . '@example.com',
            'message' => 'Message content ' . random_int(1, 99999),
            'created_at' => $ts,
            'updated_at' => $ts,
        ]));
    }

    // Expected order: newest first (descending by created_at)
    return $messages->sortByDesc('created_at')->pluck('id')->values()->all();
}

/**
 * Property 13: Admin contact messages list returns messages ordered by created_at descending.
 *
 * For any randomly generated set of contact messages with different creation timestamps,
 * the admin contact-messages index endpoint should return them newest first.
 *
 * Validates: Requirements 8.5
 */
it('Property 13: contact messages are returned ordered by created_at descending', function () {
    $this->withoutVite();
    $user = User::factory()->create();

    for ($i = 0; $i < PROPERTY13_ITERATIONS; $i++) {
        // Clean slate each iteration
        ContactMessage::query()->delete();

        $expectedOrder = generateRandomContactMessages();

        $response = $this->actingAs($user)
            ->get(route('admin.contact-messages.index'));

        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($i, $expectedOrder) {
            $returnedMessages = $page->toArray()['props']['contactMessages']['data'];
            $returnedIds = array_map(fn ($m) => $m['id'], $returnedMessages);

            expect($returnedIds)->toBe($expectedOrder,
                "Iteration {$i}: Messages not ordered by created_at descending. " .
                "Expected: [" . implode(',', $expectedOrder) . "] Got: [" . implode(',', $returnedIds) . "]"
            );
        });
    }
})->group('Feature: product-showcase', 'Property 13: Contact messages ordered by creation date');
