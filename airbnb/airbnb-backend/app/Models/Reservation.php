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
}
