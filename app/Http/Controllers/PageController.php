<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use DB;

/**
 * Tags: PageModule
 *
 * @to Pages - Page
 */
class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      // return DB::table('pages')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    { //return $request;
      $this->validate($request, [
        // 'email' => 'required|string|email|max:255|unique:users'
      ]);

      $pageDeleted = Page::onlyTrashed()->whereNotNull('deleted')->first();

      if ($pageDeleted) {
        $pageDeleted->restore();
        $request->pageDeleted = 1; // Replace Deleted Page
        return $this->update($request, $pageDeleted->slug);
      } else $pageRestore = Page::onlyTrashed()->where('slug', $request->slug)->restore(); // Restore Page
      if ($pageRestore) return $this->show($request, 1); $post = new Page;
      if ($request->locale) $post->locale = $request->locale;
      if ($request->icon) $post->icon = $request->icon;
      if ($request->page_title) {
        $post->page_title = $request->page_title;
        if ($request->method == 'post') $post->slug = $this->slugify($request->page_title);
        else $post->slug = $request->slug;
      } // Title and URL Slugify Title
      if ($request->description) $post->description = $request->description;
      if ($request->pics) $post->pics = $request->pics;
      if ($request->content) $post->content = $request->content;
      $post->save(); return $this->show($request, 1); // TagStore: PageModule
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    { //return $request;

      if ($request->showPage) return Page::where([ // TagShow PageModule
        ['slug', $request->slug], ['locale', $request->locale]
      ])->first(); // Show Local Page

      if ($request->pages) return Page::where('locale', $request->locale)->get();// Show All Locale Pages
      else return Page::onlyTrashed()
        ->where('locale', $request->locale)
        ->whereNull('deleted')
        ->get(); // Show Achieved Locale Pages



      // {
      //   if (isset($locale_pages[0]->id)) return $locale_pages; // NotInUse // Show All First Lang if Empty
      //   else { // Get First Available Lang Pages
      //     $locale = Page::where('locale', '<>', null)->first()->locale;
      //     return Page::where('locale', $locale)->get();
      //   } // NotInUse
      // }

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    { //return $request;
      $put = Page::where([['locale', $request->locale], ['slug', $request->slug]])->first();

      if ($request->pageDeleted) // Replace Deleted Page
        $put = Page::where('slug', $id)->first();

      if ($request->active) {
        Page::where('slug', $id)->update([
          'active' => $request->activePages?0:1
        ]); // Activate And Deactivate Page
        return [
          'success' => $request->message,
          'page' => Page::where('slug', $id)->first()
        ];
      }

      if (!$put) return $this->store($request); // Create New Locale Page

      // if ($request->locale) $put->locale = $request->locale;
      if ($request->page_title) {
        $put->page_title = $request->page_title;
        if ($request->pageDeleted)  $put->slug =
        $this->slugify($put->page_title); // Slugify Replaced Deleted Page Title
        Page::where('slug', $put->slug)->update([
          // 'slug' => $this->slugify($put->page_title)
        ]); // Update Slugify Title
      } // Title and URL Slugify Title
      if ($request->slug) Page::where('slug', $put->slug)->update([
        'slug' => $this->slugify($request->slug)
      ]); // Custom Slug
      if ($put->deleted) $put->deleted = Null;
      if ($request->locale) $put->locale = $request->locale;
      if ($request->description) $put->description = $request->description;
      if ($request->icon) $put->icon = $request->icon;
      if ($request->content) $put->content = $request->content;
      if ($request->get('pics')) {
        foreach ($request->pics as $pic) {
          $name = time().'.' . explode('/', explode(':', substr($pic, 0, strpos($pic, ';')))[1])[1];
          \Image::make($pic)->save(public_path('images/post/').$name);
          Pic::create([
            'page_id' => $request->post_id,
            'pic' => 'images/post/'.$name
          ]);
        } $put->pics = Pic::where('post_id', $request->post_id)->get(); // Update Pic in Post
      } $put->update(); return $this->show($request, 1); // TagUpdate: PageModule
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
      Page::onlyTrashed()->where('slug', $request->slug)->update(['deleted' => $request->forever]);
      Page::where('slug', $request->slug)->delete(); // TagDestroy: PageModule
      // if ($request->forever) return $page->update(['delete' => 1]);
      return $this->show($request, 1);
    }

    public static function slugify($text)
    {
      // replace non letter or digits by -
      $text = preg_replace('~[^\pL\d]+~u', '-', $text);

      // transliterate
      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

      // remove unwanted characters
      $text = preg_replace('~[^-\w]+~', '', $text);

      // trim
      $text = trim($text, '-');

      // remove duplicate -
      $text = preg_replace('~-+~', '-', $text);

      // lowercase
      $text = strtolower($text);

      if (empty($text)) {
        return 'n-a';
      }

      return $text;
    }
}
