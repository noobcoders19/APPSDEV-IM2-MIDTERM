<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentApplication extends Model
{
    protected $table = 'applications';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'full_name',
        'student_name',
        'email',
        'phone',
        'age',
        'gender',
        'course_input',
        'desired_course',
        'address',
        'previous_school',
        'previous_school_year',
        'guardian_name',
        'guardian_phone',
        'profile_picture',
        'photo_2x2',
        'valid_id',
        'report_card',
        'birth_certificate',
        'status',
        'student_id_number',
        'appointment_title',
        'appointment_date',
        'appointment_venue',
        'admin_message',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'datetime',
        ];
    }
}
