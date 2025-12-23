<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($data);

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully.',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Verify current password
        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

        // Update password
        $user->update([
            'password' => bcrypt($data['password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'theme' => ['required', 'string', Rule::in(['light', 'dark'])],
            'currency' => ['required', 'string', Rule::in(['EUR', 'USD', 'GBP'])],
            'date_format' => ['required', 'string', Rule::in(['d-m-Y', 'Y-m-d', 'm/d/Y'])],
            'language' => ['required', 'string', Rule::in(['nl', 'en'])],
        ]);

        $user->update($data);

        return response()->json([
            'user' => $user,
            'message' => 'Preferences updated successfully.',
        ]);
    }

    public function delete(Request $request)
    {
        $user = $request->user();

        // Verify password before deletion
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        // Delete all user's tokens
        $user->tokens()->delete();

        // Delete the user (cascade will delete all related data)
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully.',
        ]);
    }
}
