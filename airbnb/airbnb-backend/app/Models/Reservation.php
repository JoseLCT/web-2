<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        "owner_id",
        "guest_id",
        "accommodation_id",
        "start_date",
        "end_date",
        "card_name",
        "card_number",
        "card_expiration",
        "card_cvv"
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, "owner_id")->select(["id", "fullname", "email"]);
    }


    public function accommodation()
    {
        return $this->belongsTo(Accommodation::class, "accommodation_id")->select(["id", "name", "address", "type", "description", "rooms", "beds", "bathrooms", "capacity", "wifi", "night_price", "cleaning_fee", "start_date", "end_date", "lat", "lng"]);
    }
}
