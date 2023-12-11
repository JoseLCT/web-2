<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\AccommodationImage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AccommodationImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        AccommodationImage::all();
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
    public function store(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "image" => ['required', 'image'],
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(),
                Response::HTTP_BAD_REQUEST);
        }
        $accommodation = Accommodation::find($id);
        if ($accommodation == null) {
            return response()->json(
                array(
                    "message" => "Accommodation not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $maxId = AccommodationImage::max('id') + 1;
        $file = $request->file("image");
        $extension = $file->getClientOriginalExtension();
        $filename = $maxId . '.' . $extension;
        $file->move('uploads/accommodations', $filename);
        $accommodationImage = new AccommodationImage();
        $accommodationImage->accommodation_id = $id;
        $accommodationImage->url = '/uploads/accommodations/' . $filename;
        $accommodationImage->extension = $extension;
        $accommodationImage->save();
        return AccommodationImage::find($accommodationImage->id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $accommodationImage = AccommodationImage::find($id);
        if ($accommodationImage == null) {
            return response()->json(
                array(
                    "message" => "AccommodationImage not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        return AccommodationImage::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccommodationImage $accommodationImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AccommodationImage $accommodationImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $accommodationImage = AccommodationImage::find($id);
        if ($accommodationImage == null) {
            return response()->json(
                array(
                    "message" => "AccommodationImage not found"
                ),
                Response::HTTP_NOT_FOUND
            );
        }
        $path = substr($accommodationImage->url, 1);
        if (file_exists($path)) {
            unlink($path);
        }
        $accommodationImage->delete();
        return response()->json(
            array(
                "message" => "AccommodationImage deleted successfully"
            ),
            Response::HTTP_OK
        );
    }

    public function destroyAll($id)
    {
        $accommodationImages = AccommodationImage::where('accommodation_id', $id)->get();
        foreach ($accommodationImages as $accommodationImage) {
            $path = substr($accommodationImage->url, 1);
            if (file_exists($path)) {
                unlink($path);
            }
            $accommodationImage->delete();
        }
        return response()->json(
            array(
                "message" => "AccommodationImages deleted successfully"
            ),
            Response::HTTP_OK
        );
    }
}
