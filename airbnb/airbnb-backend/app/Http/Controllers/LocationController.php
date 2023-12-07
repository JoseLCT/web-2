<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Location::all();
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
    public function store(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            "country" => ['required', 'string'],
            "city" => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        $location = Location::create($request->json()->all());
        return Location::find($location->id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $location = Location::find($id);
        if ($location == null) {
            return response()->json(
                array(
                    "message" => "Location not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return $location;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $ubication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $location = Location::find($id);
        if ($location == null) {
            return response()->json(
                ["message" => "Location not found"],
                Response::HTTP_NOT_FOUND
            );
        }
        if ($request->method() == "PUT") {
            $validator = Validator::make($request->json()->all(), [
                "country" => ['required', 'string'],
                "city" => ['required', 'string'],
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(),
                    Response::HTTP_BAD_REQUEST);
            }
        }
        $location->fill($request->json()->all());
        $location->save();
        return Location::find($location->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $location = Location::find($id);
        if ($location == null) {
            return response()->json(
                ["message" => "Location not found"],
                Response::HTTP_NOT_FOUND
            );
        }
        $location->delete();
        return response()->json(
            array(
                "message" => "Location deleted"
            ),
            Response::HTTP_OK
        );
    }
}
