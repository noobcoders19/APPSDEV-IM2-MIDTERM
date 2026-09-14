<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('full_name')->nullable();
            $table->string('student_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('course_input')->nullable();
            $table->string('desired_course')->nullable();
            $table->text('address')->nullable();
            $table->string('previous_school')->nullable();
            $table->string('previous_school_year')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('photo_2x2')->nullable();
            $table->string('valid_id')->nullable();
            $table->string('report_card')->nullable();
            $table->string('birth_certificate')->nullable();
            $table->string('status')->default('pending');
            $table->string('student_id_number')->nullable();
            $table->string('appointment_title')->nullable();
            $table->dateTime('appointment_date')->nullable();
            $table->string('appointment_venue')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
