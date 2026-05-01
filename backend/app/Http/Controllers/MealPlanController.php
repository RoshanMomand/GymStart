<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMealPlanRequest;
use App\Http\Requests\UpdateMealPlanRequest;
use App\Models\MealPlan;
use App\Services\MealPlanService;

class MealPlanController extends Controller
{

    public function __construct(protected MealPlanService $mealPlanService)
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMealPlanRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MealPlan $mealPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MealPlan $mealPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMealPlanRequest $request, MealPlan $mealPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MealPlan $mealPlan)
    {
        //
    }

}
