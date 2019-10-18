<?php

namespace App\Http\Controllers;

use App\CustomDoc;
use App\DocumentPack;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Webpatser\Uuid\Uuid;

class DocumentPackController extends Controller
{
    public function updateImage(Request $request)
    {
        $documentPack = DocumentPack::find($request->id);
        $fieldName = $request->field_name;

        if ($documentPack->$fieldName) {
            Storage::delete($documentPack->$fieldName);
        }

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

    public function deleteImage(Request $request)
    {
        $documentPack = DocumentPack::find($request->id);
        $fieldName = $request->field_name;
        Storage::delete($documentPack->$fieldName);
        $documentPack->update([$fieldName => null]);
        $user = User::with('documentPack')->find($documentPack->user_id);
        return response()->json($user->toArray());
    }

    public function addCustomDoc(Request $request)
    {
        $documentPack = DocumentPack::find($request->id);
        $documentPack->addCustomDoc($request->name);
        $user = User::with('documentPack')->find($documentPack->user_id);
        return response()->json($user->toArray());
    }

    public function deleteCustomDoc(Request $request)
    {
        $customDoc = CustomDoc::find($request->id);
        $user = User::find($customDoc->documentPack->user_id);
        $customDoc->delete();
        $user->load('documentPack');
        return response()->json($user->toArray());
    }
}
