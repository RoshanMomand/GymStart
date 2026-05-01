<?php

namespace App\Http\Controllers;

use App\Services\FoodApiService;
use Illuminate\Http\Request;

class FoodController extends Controller
{

    public function __construct(protected FoodApiService $foodApiService)
    {
        $this->foodApiService = $foodApiService;
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => ['required' , 'string' , 'min:2']
        ]);

        $foods = $this->foodApiService->getAllFoods($request->query('query'));

        return response()->json($foods);

    }
}
