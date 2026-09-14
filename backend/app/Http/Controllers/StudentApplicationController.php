<?php

namespace App\Http\Controllers;

use App\Models\StudentApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentApplicationController extends Controller
{
    public function get(Request $request): JsonResponse
    {
        $userId = $request->route('user_id');
        $application = StudentApplication::where('user_id', $userId)->latest('id')->first();

        return response()->json($application ?: []);
    }

    public function saveProfile(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'full_name' => 'required|string',
            'phone' => 'required|string',
            'age' => 'required|integer|min:1|max:120',
            'address' => 'required|string',
        ]);

        $data = $request->only([
            'user_id', 'full_name', 'phone', 'age', 'gender', 'course_input',
            'address', 'previous_school', 'guardian_name',
        ]);

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('uploads', 'public');
            $data['profile_picture'] = $path;
        }

        $data['status'] = 'pending';

        $application = StudentApplication::updateOrCreate(
            ['user_id' => $request->user_id],
            $data
        );

        return response()->json([
            'message' => 'Profile saved successfully',
            'data' => $application,
        ]);
    }

    public function saveApplication(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required',
            'course_input' => 'required|string',
        ]);

        $data = ['course_input' => $request->course_input];

        $fileFields = ['photo_2x2', 'valid_id', 'report_card', 'birth_certificate'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('uploads', 'public');
                $data[$field] = $path;
            }
        }

        $application = StudentApplication::updateOrCreate(
            ['user_id' => $request->user_id],
            $data
        );

        return response()->json([
            'message' => 'Application requirements submitted successfully',
            'data' => $application,
        ]);
    }

    public function destroy(string $userId): JsonResponse
    {
        StudentApplication::where('user_id', $userId)->delete();

        return response()->json(['message' => 'Application deleted successfully!']);
    }
}
