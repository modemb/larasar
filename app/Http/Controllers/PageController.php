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
    public function save($request)
    {
      $page = $this->page; if (!$page) return;

      if ($request->page_title) {
        $page->page_title = $request->page_title;
        if ($request->method == 'post') $page->slug = $this->slugify($page->page_title); // Create Slug Page
        else $page->slug = $request->slug; // Add New Slug Page
      } // Title and URL Slugify Title

      if ($request->locale) $page->locale = $request->locale;
      if ($request->icon) $page->icon = $request->icon;
      if ($request->description) $page->description = $request->description;
      if ($request->pics) $page->pics = $request->pics;
      if ($request->content) $page->content = $request->content;

      if ($page->deleted) $page->deleted = Null; $page->save();

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

      if ($request->restore) {
        Page::onlyTrashed()->whereNull('deleted')->where('slug', $request->slug)->restore();
        return $this->show($request, 1);
      } // Restore Page

      if ($pageDeleted) $pageDeleted->restore();

      $this->page = $pageDeleted??new Page; $this->save($request);

      return $this->show($request, 1); // TagStore: PageModule
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    { //return $request;

      if ($id==='showPage') return Page::where([ // TagShow PageModule
        ['slug', $request->slug], ['locale', $request->locale]
      ])->first(); // Show Local Page

      if ($request->pages) return Page::where('locale', $request->locale)->get();// Show All Locale Pages
      else return Page::onlyTrashed()
        ->where('locale', $request->locale)
        ->whereNull('deleted')
        ->get(); // Show Achieved Locale Pages
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
      $page = $this->page = Page::where([['locale', $request->locale], ['slug', $request->slug]])->first();

      if ($request->active) {
        Page::where('slug', $id)->update([
          'active' => $request->activePages?0:1
        ]); return [
          'success' => $request->message,
          'page' => Page::where('slug', $id)->first()
        ];
      } // Activate And Deactivate Page

      if ($request->updateSlug) $page = Page::where('slug', Page::find($id)->slug)->update([
        'slug' => $this->slugify($request->slug)
      ]); // Custom Slug

      if (!$page) return $this->store($request); // Create New Locale Page

      if ($request->get('pics')) {
        foreach ($request->pics as $pic) {
          $name = time().'.' . explode('/', explode(':', substr($pic, 0, strpos($pic, ';')))[1])[1];
          \Image::make($pic)->save(public_path('images/post/').$name);
          Pic::create([
            'page_id' => $request->post_id,
            'pic' => 'images/post/'.$name
          ]);
        } $page->pics = Pic::where('post_id', $request->post_id)->get(); // Update Pic in Post
      } $this->save($request); 
      return $this->show($request, 1); // TagUpdate: PageModule
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
      // Page::onlyTrashed()->where('slug', $id)->update(['deleted' => $request->forever]);
      // Page::where('slug', $id)->delete(); // TagDestroy: PageModule
      Page::onlyTrashed()->where('id', $id)->update(['deleted' => $request->forever]);
      Page::destroy($id); // TagDestroy: PageModule

      return $this->show($request, $id);
    }

    public static function slugify($text)
    {
      $text = preg_replace('~[^\pL\d]+~u', '-', $text);// replace non letter or digits by -
      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);// transliterate
      $text = preg_replace('~[^-\w]+~', '', $text);// remove unwanted characters
      $text = trim($text, '-');// trim
      $text = preg_replace('~-+~', '-', $text);// remove duplicate -
      $text = strtolower($text);// lowercase

      if (empty($text)) return 'n-a';
      else return $text;
    }
}
