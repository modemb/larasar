<?php

namespace App\Files;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class FileData
{
    /**
     * User's Image
     *
     */
    public static function upload($file)
    {
      // $file = $request->file('img');
      // $fileName = $id.'.png'; // $file->getClientOriginalName();
      // $path = $file->storeAs('files/', $fileName);
      // $file->move('files/', $fileName); return $path;

      if (preg_match('/^data:(.*);base64,/', $file, $matches)) {
          $mimeType = $matches[1]; // Get the mime type
          $data = substr($file, strpos($file, ',') + 1);
          $data = base64_decode($data);

          $extension = explode('/', $mimeType)[1]; // Determine the file extension
          $filename = uniqid() . '.' . $extension; // Create a unique filename
          // $filename = time() . '.png';

          Storage::disk('public')->put($filename, $data); // Store the file in the 'public' disk

          return $path = 'files/'.$filename;
      }   return null; // Extract base64 data from DataURL

      try { // https://image.intervention.io/v2/api/encode
        $type = explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
        $fileName = time().'.'.$type; // File Name And Extension
        $path = 'files/'.$fileName; // Path To The File
        \Image::make($file)->save(public_path($path));
        // Image::make($pic)->save(public_path('files/').$path, 50, 'jpg');
        // create a new image directly from Laravel file upload
        // $file = Image::make(Input::file('photo'));
      } catch (\Throwable $th) {
        $path = null; // throw $th;
      } return $path; // FileModule
    }

    /**
     * User's Logs
     *
     */
    public static function showLog()
    {
        $path = storage_path('logs/laravel.log');

        $content = File::get($path);
        $content = nl2br($content); // Optional: Convert newlines to <br>

        if (File::exists($path))
        if (File::delete($path)) return compact('content');
    }

    /**
     * User's Image
     *
     */
    public static function delete($path)
    { // Storage::delete(['file.jpg', 'file2.jpg']);

      $file = str_replace('files/', '', $path);
      $file_path = public_path($path);

      // if (Storage::disk('public')->exists($file)) {
      //   if (Storage::delete($file)) return 'File Deleted Forever';
      //   else return 'Unable To Delete File';
      // } else return 'File Does Not Exist';

      if (File::exists($file_path)) {
        if (File::delete($file_path)) return 'File Deleted Forever';
        else return 'Unable To Delete File';
      } else return 'File Does Not Exist';

      if (file_exists($path)) {
          if (unlink($path)) return 'File Deleted Forever';
          else return 'Unable To Delete File';
      } else return 'File Does Not Exist';

    } // https://laravel.com/docs/11.x/filesystem#retrieving-files

}
