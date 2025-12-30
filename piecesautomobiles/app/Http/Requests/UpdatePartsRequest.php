<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'sku' => ['nullable', 'string', 'max:255', 'min:3'],
            'name' => ['required', 'string', 'max:255', 'min:3'],
            'description' => ['nullable', 'string', 'max:255', 'min:3'],
            'brand' => ['required', 'string', 'max:255', 'min:3'],
            'model' => ['required', 'string', 'max:255', 'min:2'],
            'year' => ['required', 'digits:4', 'min:0', 'max:9999'],
            'price' => ['nullable', 'string', 'max:255', 'min:3'],
            'image' => ['nullable', 'string', 'max:255', 'min:3'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'box_id' => ['nullable', 'exists:boxes,id'],
        ];
    }
}
