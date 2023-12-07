<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request) {
        $validator = Validator::make($request->json()->all(), [
            "email" => ['required', 'string'],
            "password" => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        if (!auth()->attempt($request->json()->all())) {
            return response()->json(
                array(
                    "message" => "Invalid credentials"
                ),
                Response::HTTP_UNAUTHORIZED
            );
        }
        $accessToken = auth()->user()->createToken('authToken')->plainTextToken;
        return response()->json(
            array(
                "access_token" => $accessToken,
            ),
            Response::HTTP_OK
        );
    }

    public function register(Request $request) {
        $validator = Validator::make($request->json()->all(), [
            "first_name" => ['required', 'string'],
            "last_name" => ['required', 'string'],
            "email" => ['required', 'string'],
            "password" => ['required', 'string'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        $userExists = User::where('email', $request->json()->get("email"))->first();
        if ($userExists != null) {
            return response()->json(
                array(
                    "message" => "User already exists"
                ),
                Response::HTTP_BAD_REQUEST
            );
        }
        $user = User::create($request->json()->all());
        return User::find($user->id);
    }

    public function me(Request $request) {
        $user = $request->user();
        return $user;
    }
}
