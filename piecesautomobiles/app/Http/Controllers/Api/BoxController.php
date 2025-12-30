<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoxRequest;
use App\Http\Requests\UpdateBoxRequest;
use App\Http\Resources\BoxResource;
use App\Models\Box;

/**
 * Class BoxController
 * @package App\Http\Controllers\Api
 * @group Box
 * @authenticated
 * API for managing boxes
 * where('user_id', auth()->user()->id)
 */
class BoxController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return BoxResource::collection(
            Box::query()
                ->where('user_id', auth()->user()->id)
                ->orderBy('id', 'asc')
                ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreBoxRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreBoxRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;
        $box = Box::create($data);
        return response(new BoxResource($box), 201);
    }

    /**
     * Display the specified resource.
     * @param Box $box
     * @return BoxResource
     */
    public function show(Box $box)
    {
        return new BoxResource($box);
    }

    /**
     * Update the specified resource in storage.
     * @param UpdateBoxRequest $request
     * @param Box $box
     * @return BoxResource
     */
    public function update(UpdateBoxRequest $request, Box $box)
    {
        $data = $request->validated();
        // Check if the user is authorized to update the resource
        if ($box->user_id !== auth()->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $box->update($data);
        return new BoxResource($box);
    }

    /**
     * Remove the specified resource from storage.
     * @param Box $box
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Box $box)
    {
        // Check if the user is authorized to delete the resource
        if ($box->user_id !== auth()->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $box->delete();
        return response()->json(null, 204);
    }
}
