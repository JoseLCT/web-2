<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AccommodationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Accommodation::with("images", "location")->get();
    }

    public function getByUserId($id)
    {
        $user = User::find($id);
        if ($user == null) {
            return response()->json(
                array(
                    "message" => "User not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return Accommodation::with("images")->where("user_id", $id)->get();
    }

    public function getByToken(Request $request)
    {
        $user = $request->user();
        if ($user == null) {
            return response()->json(
                array(
                    "message" => "User not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return Accommodation::with("images")->where("user_id", $user->id)->get();
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
            "location_id" => ['required', 'integer'],
            "name" => ['required', 'string'],
            "address" => ['required', 'string'],
            "type" => ['required', 'in:casa,apartamento,hotel'],
            "description" => ['required', 'string'],
            "rooms" => ['required', 'integer'],
            "beds" => ['required', 'integer'],
            "bathrooms" => ['required', 'integer'],
            "capacity" => ['required', 'integer'],
            "wifi" => ['required', 'boolean'],
            "night_price" => ['required', 'numeric'],
            "cleaning_fee" => ['required', 'numeric'],
            "start_date" => ['required', 'date'],
            "end_date" => ['required', 'date'],
            "lat" => ['required', 'string'],
            "lng" => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        $user = $request->user();
        if ($user == null) {
            return response()->json(
                array(
                    "message" => "User not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $request->json()->set("user_id", $user->id);
        $locationId = $request->json()->get("location_id");
        $location = Location::find($locationId);
        if ($location == null) {
            return response()->json(
                array(
                    "message" => "Location not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $accommodation = Accommodation::create($request->json()->all());
        return Accommodation::find($accommodation->id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $accommodation = Accommodation::find($id);
        if ($accommodation == null) {
            return response()->json(
                array(
                    "message" => "Accommodation not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return Accommodation::with("user", "images", "location")->find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Accommodation $accommodation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $accommodation = Accommodation::find($id);
        if ($accommodation == null) {
            return response()->json(
                ["message" => "Accommodation not found"],
                Response::HTTP_NOT_FOUND
            );
        }
        if ($request->method() == "PUT") {
            $validator = Validator::make($request->json()->all(), [
                "user_id" => ['required', 'integer'],
                "location_id" => ['required', 'integer'],
                "name" => ['required', 'string'],
                "address" => ['required', 'string'],
                "type" => ['required', 'in:casa,apartamento,hotel'],
                "description" => ['required', 'string'],
                "rooms" => ['required', 'integer'],
                "beds" => ['required', 'integer'],
                "bathrooms" => ['required', 'integer'],
                "capacity" => ['required', 'integer'],
                "wifi" => ['required', 'boolean'],
                "night_price" => ['required', 'numeric'],
                "cleaning_fee" => ['required', 'numeric'],
                "start_date" => ['required', 'date'],
                "end_date" => ['required', 'date'],
                "lat" => ['required', 'string'],
                "lng" => ['required', 'string'],
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(),
                    Response::HTTP_BAD_REQUEST);
            }
        }
        $userId = $request->json()->get("user_id");
        if ($userId != null) {
            $user = User::find($userId);
            if ($user == null) {
                return response()->json(
                    array(
                        "message" => "User not found"
                    ),
                    Response::HTTP_NOT_FOUND
                );
            }
        }
        $locationId = $request->json()->get("location_id");
        if ($locationId != null) {
            $location = Location::find($locationId);
            if ($location == null) {
                return response()->json(
                    array(
                        "message" => "Location not found"
                    ),
                    Response::HTTP_NOT_FOUND
                );
            }
        }
        $accommodation->fill($request->json()->all());
        $accommodation->save();
        return Accommodation::find($accommodation->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $accommodation = Accommodation::find($id);
        if ($accommodation == null) {
            return response()->json(
                ["message" => "Accommodation not found"],
                Response::HTTP_NOT_FOUND
            );
        }
        $accommodation->delete();
        return response()->json(
            ["message" => "Accommodation deleted"],
            Response::HTTP_OK
        );
    }
}
