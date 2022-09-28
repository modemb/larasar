<?php

namespace App\Services;

use App\Models\User;

// Construct a request object and set desired parameters PayPal
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
// Before capture, Order should be approved by the buyer using the approval URL returned in the create order response.
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class Checkout
{
    /**
     * User's PayPal
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function paypal($request)
    {
      $paypal = config('services.paypal'); // TagPayPal: ConfigModule
      if ($request->liveMode) $environment = new ProductionEnvironment($paypal['clientId'], $paypal['clientSecret']);
      else $environment = new SandboxEnvironment($paypal['clientSandboxId'], $paypal['clientSandboxSecret']);
      $client = new PayPalHttpClient($environment); // Creating an environment

      if ($request->order) {
        $postURL = url('/').'/post/'.$request->post_id;
        $url = $postURL==$request->href?$postURL:$request->href;

        $orderRequest = new OrdersCreateRequest();
        $orderRequest->prefer('return=representation');
        $orderRequest->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "reference_id" => $request->plan, //"test_ref_id1",
                "amount" => [
                    "value" => $request->paymentAmount,
                    "currency_code" => $request->currency_code
                ]
            ]],
            "application_context" => [
              "cancel_url" => $url,
              "return_url" => $url
            ]
        ];

        try {
          // Call API with your client and get a response for your call
          $response = $client->execute($orderRequest);
          return $response;//print_r($response);
          // return json_encode($response);
        } catch (HttpException $ex) {
          echo $ex->statusCode;
          print_r($ex->getMessage());
        }

      } elseif ($request->capture) {
        // Here, OrdersCaptureRequest() creates a POST request to /v2/checkout/orders
        // $response->result->id gives the orderId of the order created above
        // $requestCapture = new OrdersCaptureRequest("APPROVED-ORDER-ID");
        $requestCapture = new OrdersCaptureRequest($request->token);
        $requestCapture->prefer('return=representation');
        try {
            // Call API with your client and get a response for your call
            $response = $client->execute($requestCapture);

            // If call returns body in response, you can get the deserialized version from the result attribute of the response
            return $response; // print_r($response);
        } catch (HttpException $ex) {
            echo $ex->statusCode;
            print_r($ex->getMessage());
        }

      }
    }

    /**
     * User's Stripe
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function stripe($request)
    {
      config([
        'cashier.key' => $request->liveMode ? env('STRIPE_KEY') : env('STRIPE_TEST_KEY'),
        'cashier.secret' => $request->liveMode ? env('STRIPE_SECRET') : env('STRIPE_TEST_SECRET'),
        'cashier.currency_locale' => app()->getLocale(),
        'cashier.currency' => $request->currency_code
      ]); // TagStripe: ConfigModule
      try {
        $user = User::find($request->auth['id']); // auth()->user();
        $payment = $user->charge(
          $request->input('paymentAmount'),
          $request->input('payment_method_id')
        ); // Laravel Cashier (Stripe)
        return $payment = $payment->asStripePaymentIntent();
      } catch (\Exception $e) { // https://laravel.com/docs/9.x/billing#simple-charge
        return ['message' => $e->getMessage()];
        // return response()->json(['message' => $e->getMessage()], 500);
      } return ['id' => 'strip'.time()]; // Prevent Admins To Be Charge
    }

    /**
     * User's Converge
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function converge($request)
    {
      // Create new PaymentProcessor object
      $PaymentProcessor = new \markroland\Converge\ConvergeApi(
          env('CONVERGE_MERCHANTID'),
          env('CONVERGE_USERID'),
          env('CONVERGE_PIN'),
          env('CONVERGE_LIVE')
      );

      // Submit a purchase
      $response = $PaymentProcessor->ccsale([
          // 'ssl_amount' => '9.99',
          // 'ssl_card_number' => '5000300020003003',
          // 'ssl_cvv2cvc2' => '123',
          // 'ssl_exp_date' => '1222',
          // 'ssl_avs_zip' => '37013',
          // 'ssl_avs_address' => '123 main',
          // 'ssl_last_name' => 'Smith'


          'ssl_amount' => $request->cc_total,
          'ssl_cvv2cvc2' => $request->cc_cvn,
          'ssl_exp_date' => $request->cc_month.$request->cc_year,
          // 'cc_month' => $request->cc_month,
          'ssl_card_number' => $request->cc_number,
          'ssl_last_name' => $request->last_name,
          'ssl_first_name' => $request->first_name
          // 'ssl receipt link text'=>'Continue'
      ]);// return $response['ssl_result_message'];

      if (isset($response['ssl_result_message']) and $response['ssl_result_message']==='APPROVAL') {//-----Success------


      } else {//-----Fail------
          return response()->json([
              'fail' => $response['errorMessage']
          ]);
      }

    }
}
