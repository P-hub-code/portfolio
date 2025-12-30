<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePartsSalesRequest;
use App\Http\Requests\UpdatePartsSalesRequest;
use App\Http\Resources\PartsSalesResource;
use App\Models\Parts;
use App\Models\PartsSales;

/**
 * Class PartsSalesController
 * @package App\Http\Controllers\Api
 * @group Parts Sales
 * @authenticated
 * API for managing parts sales
 */
class PartsSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     * @authenticated
     * @group Parts Sales
     * API for managing parts sales
     * where('user_id', auth()->user()->id)
     */
    public function index()
    {
        return PartsSalesResource::collection(
            PartsSales::query()
                ->with('part') // Eager loading part to avoid N+1 
                ->where('user_id', auth()->user()->id)
                ->orderBy('id', 'asc')
                ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     * @param StorePartsSalesRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePartsSalesRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->user()->id;
        $data['part_id'] = $request->part_id;

        // Return if the quantity is more than the available quantity( convert to integer)
        if ($data['quantity'] > Parts::find($data['part_id'])->quantity) {
            return response()->json(['message' => 'A quantidade vendida é maior que a disponível'], 400);
        }

        $sale = PartsSales::create($data);

        // Update the quantity of the part
        $part = $sale->part;
        $part->update(['quantity' => $part->quantity - $sale->quantity]);
        $part->save();

        return response(new PartsSalesResource($sale), 201);
    }

    /**
     * Display the specified resource.
     * @param PartsSales $sale
     * @return PartsSalesResource
     */
    public function show(PartsSales $sale)
    {
        // Eager loading part
        $sale->load('part');
        return new PartsSalesResource($sale);
    }

    /**
     * Update the specified resource in storage.
     * @param UpdatePartsSalesRequest $request
     * @param PartsSales $sale
     * @return PartsSalesResource
     */
    public function update(UpdatePartsSalesRequest $request, PartsSales $sale)
    {
        $data = $request->validated();
        // Check if the user is authorized to update the resource
        if ($sale->user_id !== auth()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $sale->update($data);
        return new PartsSalesResource($sale);
    }

    /**
     * Remove the specified resource from storage.
     * @param PartsSales $sale
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PartsSales $sale)
    {
        // Check if the user is authorized to delete the resource
        if ($sale->user_id !== auth()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        //Update the quantity of the part
        $part = $sale->part;
        $part->update(['quantity' => $part->quantity + $sale->quantity]);
        $part->save();
        $sale->delete();
        return response()->json(null, 204);
    }
}
