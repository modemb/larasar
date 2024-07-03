<?php

namespace App\Files;

use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\File;

class Picture
{
    /**
     * User's Image
     *
     */
    public function image($img)
    {
      // $file = $request->file('img');
      // $fileName = $id.'.png'; // $file->getClientOriginalName();
      // $path = $file->storeAs('files/', $fileName);
      // $file->move('files/', $fileName); return $path;

      // Extract base64 data from DataURL
      if (preg_match('/^data:(.*);base64,/', $img, $matches)) {
          $mimeType = $matches[1]; // Get the mime type
          $data = substr($img, strpos($img, ',') + 1);
          $data = base64_decode($data);

          // Determine the file extension
          $extension = explode('/', $mimeType)[1];

          // Create a unique filename
          $filename = uniqid() . '.' . $extension;
          // $filename = time() . '.png';

          // Store the file in the 'public' disk
          Storage::disk('public')->put($filename, $data);

          return $path = 'files/'.$filename;
      }   return null;

      try { // https://image.intervention.io/v2/api/encode
        $type = explode('/', explode(':', substr($img, 0, strpos($img, ';')))[1])[1];
        $fileName = time().'.'.$type; // File Name And Extension
        $path = 'files/'.$fileName; // Path To The File
        \Image::make($img)->save(public_path($path));
        // create a new image directly from Laravel file upload
        // $img = Image::make(Input::file('photo'));
      } catch (\Throwable $th) {
        $path = null; // throw $th;
      } return $path; // FileModule
    }

    /**
     * User's Image
     *
     */
    public function delete($img)
    {

      if (Storage::disk('s3')->exists('file.jpg')) {
          Storage::delete('file.jpg');
          Storage::delete(['file.jpg', 'file2.jpg']);
      }

    } // https://laravel.com/docs/11.x/filesystem#retrieving-files
}