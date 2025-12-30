<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShelfRequest;
use App\Http\Requests\UpdateShelfRequest;
use App\Models\Shelf;

/**
 * Class ShelfController
 * @package App\Http\Controllers\Api
 * @group Shelf
 * @authenticated
 * API for managing shelves
 */
class ShelfController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShelfRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Shelf $shelf)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShelfRequest $request, Shelf $shelf)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shelf $shelf)
    {
        //
    }
}
