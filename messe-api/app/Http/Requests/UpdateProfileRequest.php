<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request UpdateProfileRequest - Validation des données de mise à jour du profil
 *
 * Utilisé pour PUT /api/user - Compléter ou modifier fullName (nom et prénoms).
 */
class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'fullName.required' => 'Le nom complet est obligatoire.',
        ];
    }
}
