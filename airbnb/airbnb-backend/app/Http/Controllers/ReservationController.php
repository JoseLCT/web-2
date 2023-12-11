<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Reservation::all();
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
            "owner_id" => ['required', 'integer'],
            "accommodation_id" => ['required', 'integer'],
            "start_date" => ['required', 'date'],
            "end_date" => ['required', 'date'],
            "card_name" => ['required', 'string'],
            "card_number" => ['required', 'string'],
            "card_expiration" => ['required', 'string'],
            "card_cvv" => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        $ownerId = $request->json()->get("owner_id");
        $owner = User::find($ownerId);
        if ($owner == null) {
            return response()->json(
                array(
                    "message" => "Owner not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $guest = $request->user();
        $guestId = $guest->id;
        $guest = User::find($guestId);
        if ($guest == null) {
            return response()->json(
                array(
                    "message" => "Guest not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        if ($ownerId == $guestId) {
            return response()->json(
                array(
                    "message" => "Owner and guest can't be the same"
                ),
                Response::HTTP_BAD_REQUEST
            );
        }
        $accommodationId = $request->json()->get("accommodation_id");
        $accommodation = Accommodation::find($accommodationId);
        if ($accommodation == null) {
            return response()->json(
                array(
                    "message" => "Accommodation not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $request->json()->set("guest_id", $guestId);
        $reservation = Reservation::create($request->json()->all());
        return Reservation::find($reservation->id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $reservation = Reservation::find($id);
        if ($reservation == null) {
            return response()->json(
                array(
                    "message" => "Reservation not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return $reservation;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);
        if ($reservation == null) {
            return response()->json(
                ["message" => "Reservation not found"],
                Response::HTTP_NOT_FOUND
            );
        }
        if ($request->method() == "PUT") {
            $validator = Validator::make($request->json()->all(), [
                "owner_id" => ['required', 'integer'],
                "accommodation_id" => ['required', 'integer'],
                "start_date" => ['required', 'date'],
                "end_date" => ['required', 'date'],
                "card_name" => ['required', 'string'],
                "card_number" => ['required', 'string'],
                "card_expiration" => ['required', 'string'],
                "card_cvv" => ['required', 'string'],
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(),
                    Response::HTTP_BAD_REQUEST);
            }
        }
        $ownerId = $request->json()->get("owner_id");
        if ($ownerId != null) {
            $owner = User::find($ownerId);
            if ($owner == null) {
                return response()->json(
                    array(
                        "message" => "Owner not found"
                    ),
                    Response::HTTP_NOT_FOUND
                );
            }
        }
        $guest = $request->user();
        $guestId = $guest->id;
        if ($guestId != null) {
            $guest = User::find($guestId);
            if ($guest == null) {
                return response()->json(
                    array(
                        "message" => "Guest not found"
                    ),
                    Response::HTTP_NOT_FOUND
                );
            }
        }
        if ($ownerId != null && $guestId != null && $ownerId == $guestId) {
            return response()->json(
                array(
                    "message" => "Owner and guest can't be the same"
                ),
                Response::HTTP_BAD_REQUEST
            );
        }
        if ($ownerId != null && $guestId == null && $ownerId == $reservation->guest_id) {
            return response()->json(
                array(
                    "message" => "Owner and guest can't be the same"
                ),
                Response::HTTP_BAD_REQUEST
            );
        }
        if ($ownerId == null && $guestId != null && $guestId == $reservation->owner_id) {
            return response()->json(
                array(
                    "message" => "Owner and guest can't be the same"
                ),
                Response::HTTP_BAD_REQUEST
            );
        }
        $accommodationId = $request->json()->get("accommodation_id");
        if ($accommodationId != null) {
            $accommodation = Accommodation::find($accommodationId);
            if ($accommodation == null) {
                return response()->json(
                    array(
                        "message" => "Accommodation not found"
                    ),
                    Response::HTTP_NOT_FOUND
                );
            }
        }
        $reservation->update($request->json()->all());
        return $reservation;
    }

    public function getByToken(Request $request) {
        $user = $request->user();
        $userId = $user->id;
        $reservations = Reservation::where('guest_id', $userId)->with("owner", "accommodation")->get();
        return $reservations;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $reservation = Reservation::find($id);
        if ($reservation == null) {
            return response()->json(
                array(
                    "message" => "Reservation not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $reservation->delete();
        return response()->json(
            array(
                "message" => "Reservation deleted successfully"
            )
        );
    }
}
