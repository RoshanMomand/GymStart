<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealPlanTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
//        return parent::toArray($request);
        return [
            'type' => $this->type,
            'calories' => $this->calories,
            'carbs' => $this->carbs,
            'protein' => $this->protein,
            'fats' => $this->fats,
            'meals' => MealResource::collection($this->meals),
        ];
    }
}
