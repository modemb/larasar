<html>

  <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
    <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px #027be3;">
      <thead>
        <tr>
          <th style="text-align:left;"><img style="max-width: 150px;" src="https://suguffie.com/images/backup/suguffie_fb.png" alt="Suguffiè"/></th>
          <th style="text-align:right;font-weight:400;">{{$content['sale_date']}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="height:35px;"></td>
        </tr>
        <tr>
          <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
            <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:#027be3;font-weight:normal;margin:0">{{$content['token']?'Success':'Canceled'}}</b></p>
            <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Transaction ID</span>{{$content['post_id']}} {{$content['end_date']}}</p>
            <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span>{{$content['amount']}} {{$content['currency_code']}}</p>
            <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Duration</span>{{$content['start_date']}} to {{$content['end_date']}}</p>
          </td>
        </tr>
        <tr>
          <td style="height:35px;"></td>
        </tr>
        {{-- <tr>
          <td style="width:50%;padding:20px;vertical-align:top">
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Name</span>{{$content['auth']['first_name']}} {{$content['auth']['last_name']}}</p>
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span>{{$content['auth']['email']}}</p>
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Phone</span>{{$content['auth']['phone']}}</p>
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">ID No.</span>{{$content['auth']['id']}}</p>
          </td>
          <td style="width:50%;padding:20px;vertical-align:top">
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Address</span>{{$content['auth']['address']}}</p>
            <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Number of gusets</span>{{}}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Items</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:15px;">
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;">
              <span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}Homestay with fooding & lodging</span> Rs. 3500 <b style="font-size:12px;font-weight:300;"> /person/day</b>
            </p>
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}Pickup & Drop</span> Rs. 2000 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}Local site seeing with guide</span> Rs. 800 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}Tea tourism with guide</span> Rs. 500 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}River side camping with guide</span> Rs. 1500 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
            <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;"><span style="display:block;font-size:13px;font-weight:normal;">{{$content->}}Trackking and hiking with guide</span> Rs. 1000 <b style="font-size:12px;font-weight:300;"> /person/day</b></p>
          </td>
        </tr> --}}
      </tbody>
      <tfooter>
        <tr>
          <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
            <strong style="display:block;margin:0 0 10px 0;">Regards</strong>
            {{-- Bachana Tours<br> Gorubathan, Pin/Zip - 735221, Darjeeling, West bengal, India<br><br> --}}

            @component('mail::panel')
              <b>{{ config('app.name') }}</b> <br>
              Site: {{env('APP_URL')}}
            @endcomponent

          </td>
        </tr>
      </tfooter>
    </table>
  </body>

</html>
