<?php

namespace App\Http\Controllers;

use App\Models\StudentApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            StudentApplication::query()->latest('id')->get()
        );
    }

    public function updateStatus(Request $request, StudentApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'max:50'],
        ]);

        $application->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "Application status updated to {$validated['status']}",
        ]);
    }

    public function schedule(Request $request, StudentApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'appointment_date' => ['required', 'date'],
            'venue' => ['required', 'string', 'max:255'],
        ]);

        $application->update([
            'status' => 'Approved',
            'appointment_title' => $validated['title'] ?? 'On-Site Requirement Verification',
            'appointment_date' => $validated['appointment_date'],
            'appointment_venue' => $validated['venue'],
        ]);

        return response()->json([
            'message' => 'Student successfully notified with schedule!',
        ]);
    }

    public function message(Request $request, StudentApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $application->update(['admin_message' => $validated['message']]);

        return response()->json([
            'message' => 'Message sent to the student.',
        ]);
    }

    public function destroy(StudentApplication $application): JsonResponse
    {
        foreach ([
            'profile_picture',
            'photo_2x2',
            'valid_id',
            'report_card',
            'birth_certificate',
        ] as $field) {
            $file = $application->{$field};
            if ($file) {
                Storage::disk('public')->delete(
                    str_starts_with($file, 'uploads/') ? $file : "uploads/{$file}"
                );
            }
        }

        $application->delete();

        return response()->json([
            'message' => 'Application removed successfully.',
        ]);
    }
}
