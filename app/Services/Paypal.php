<?php

namespace App\Services;

// Construct a request object and set desired parameters PayPal
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
// Before capture, Order should be approved by the buyer using the approval URL returned in the create order response.
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class paypal
{
    /**
     * User' Payment
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function log($request)
    {
      $paypal = config('services.paypal'); // Creating an environment
      if ($request->sAdminIP) $environment = new ProductionEnvironment($paypal['clientId'], $paypal['clientSecret']);
      else $environment = new SandboxEnvironment($paypal['clientSandboxId'], $paypal['clientSandboxSecret']);
      $client = new PayPalHttpClient($environment);

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
                    "value" => $request->payment, //$payment['amount'],
                    "currency_code" => $request->currency_code //$payment['currency_code']
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
}
