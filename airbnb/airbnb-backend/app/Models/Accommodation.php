<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "location_id",
        "name",
        "address",
        "type",
        "description",
        "rooms",
        "beds",
        "bathrooms",
        "capacity",
        "wifi",
        "night_price",
        "cleaning_fee",
        "start_date",
        "end_date",
        "lat",
        "lng"
    ];

    public function images()
    {
        return $this->hasMany(AccommodationImage::class)->select(["id", "accommodation_id", "url", "extension"]);
    }
}
