<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', 'in:student,Student,admin,Admin'],
        ]);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'password' => $validated['password'],
            'role' => strtolower($validated['role'] ?? 'student'),
        ]);

        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (! $user || (! $this->passwordMatches($validated['password'], $user->password))) {
            return response()->json(['message' => 'Invalid email or password.'], 401);
        }

        return response()->json([
            'message' => 'Login successful!',
            'user' => $this->userPayload($user),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'currentPassword' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::where('email', strtolower(trim($validated['email'])))->first();

        if (! $user || ! $this->passwordMatches($validated['currentPassword'], $user->password)) {
            return response()->json(['message' => 'The current password is incorrect.'], 401);
        }

        $user->password = $validated['password'];
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully. You can now sign in.',
        ]);
    }

    private function passwordMatches(string $password, string $storedPassword): bool
    {
        if (password_verify($password, $storedPassword)) {
            return true;
        }

        try {
            return Hash::check($password, $storedPassword);
        } catch (\RuntimeException) {
            return hash_equals($storedPassword, $password);
        }
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->getKey(),
            'name' => $user->name,
            'email' => $user->email,
            'role' => strtolower(trim($user->role ?? 'student')),
        ];
    }
}
