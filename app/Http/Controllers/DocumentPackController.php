<?php

namespace App\Http\Controllers;

use App\DocumentPack;
use App\User;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;

class DocumentPackController extends Controller
{
    public function updateImage(Request $request)
    {
        $documentPack = DocumentPack::find($request->id);
        $fieldName = $request->field_name;
        if ($request->hasFile('image')) {
            $fileName = (string) Uuid::generate(4);
            $request->file('image')->storeAs(
                'public/documents', $fileName
            );
            $documentPack->update([$fieldName => '/storage/documents/' . $fileName]) ;
        }
        $user = User::with('documentPack')->find($documentPack->user_id);
        return response()->json($user->toArray());
    }
}
