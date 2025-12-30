<?php

namespace App\Http\Resources;

use App\Models\Box;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'price' => $this->price,
            'image' => $this->image,
            'quantity' => $this->quantity,
            'user_id' => $this->user_id,
            'box_id' => $this->box_id, // Include the box_id here
            'box_number' => Box::find($this->box_id)->number ?? null, // Include the box number here
            'created_at' => $this->created_at->format('d/m/Y'),
            'updated_at' => $this->updated_at->format('d/m/Y'),
            'box' => new BoxResource($this->whenLoaded('box')), // Optional: Include the box details using a resource
        ];
    }
}
