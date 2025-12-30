<?php

namespace App\Http\Controllers\Api;

use App\Models\Parts;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\PartsResource;
use App\Http\Requests\StorePartsRequest;
use App\Http\Requests\UpdatePartsRequest;

/**
 * Class PartsController
 * @package App\Http\Controllers\Api
 * @group Parts
 * @authenticated
 * API for managing parts
 */
class PartsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * @authenticated
     * @group Parts
     * API for managing parts
     * where('user_id', auth()->user()->id)
     */
    public function index(Request $request)
    {
        $query = Parts::query()
            ->where('user_id', auth()->user()->id)
            ->orderBy('id', 'asc');

        if ($request->has('search')) {
            $searchQuery = $request->input('search');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('brand', 'like', "%{$searchQuery}%")
                    ->orWhere('model', 'like', "%{$searchQuery}%")
                    ->orWhere('name', 'like', "%{$searchQuery}%")
                    ->orWhere('year', 'like', "%{$searchQuery}%");
            });
        }

        return PartsResource::collection($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     * @param StorePartsRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePartsRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;
        $part = Parts::create($data);
        return response(new PartsResource($part), 201);
    }

    /**
     * Display the specified resource.
     * @param Parts $part
     * @return PartsResource
     */
    public function show(Parts $part)
    {
        return new PartsResource($part);
    }

    /**
     * Update the specified resource in storage.
     * @param UpdatePartsRequest $request
     * @param Parts $part
     * @return PartsResource
     */
    public function update(UpdatePartsRequest $request, Parts $part)
    {
        $data = $request->validated();
        // Check if the user is authorized to update the resource
        if ($part->user_id !== auth()->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $part->update($data);
        return new PartsResource($part);
    }

    /**
     * Remove the specified resource from storage.
     * @param Parts $part
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Parts $part)
    {
        // Check if the user is authorized to delete the resource
        if ($part->user_id !== auth()->user()->id) {
            return response()->json([
                'id'   => $part->id,
                'error' => 'Unauthorized'
            ], 403);
        }
        $part->delete();
        return response()->json(null, 204);
    }
}
