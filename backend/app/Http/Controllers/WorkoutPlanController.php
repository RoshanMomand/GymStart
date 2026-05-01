<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkoutPlanRequest;
use App\Http\Requests\UpdateWorkoutPlanRequest;
use App\Models\WorkoutPlan;
use App\Services\WorkoutPlanService;

class WorkoutPlanController extends Controller
{

    public function __construct(protected WorkoutPlanService $workoutPlanService)
    {
        $this->workoutPlanService = $workoutPlanService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreWorkoutPlanRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkoutPlan $workoutPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkoutPlan $workoutPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkoutPlanRequest $request, WorkoutPlan $workoutPlan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkoutPlan $workoutPlan)
    {
        //
    }

}
