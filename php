<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class paymentControllerForDingerTesting extends Controller
{
    //
    public function makePayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
                'name' => 'required|max:50',
                'amount' => 'required|integer',
                'user_id' => 'required|integer'
        ]);
        if ($validator->fails()) {
            return $this->handleError($validator->errors());


         //config from dinger
        $Dinger_BaseUrl = $request->Dinger_BaseUrl;
        $Dinger_Public_Key = $request->Dinger_Public_Key;
        $Dinger_Merchant_Api_Key = $request->Dinger_Merchant_Api_Key;
        $Dinger_Secret_Key=$request->Dinger_Secret_Key;
        $Dinger_Client_Id=$request->Dinger_Client_Id;
        $Dinger_projectName=$request->Dinger_projectName;
        $Dinger_merchantName=$request->Dinger_merchantName;


        // request data
        $customerName       = $request->name;
        $amount             = $request->amount;
        $user_id            = $request->user_id;
        $merchant_order_id    = random_int(10000000,99999999);


        $items_data = array(
            "name" => $customerName,
            "amount" => $amount,
            "quantity" => 1
        );

        $data_pay = json_encode(array(
            "clientId" => $Dinger_Client_Id,
            "publicKey" => $Dinger_Public_Key,
            "items" => json_encode(array($items_data)),
            "customerName" => $customerName,
            "totalAmount" => $amount,
            "merchantOrderId" => $merchant_order_id,
            "merchantKey" => $Dinger_Merchant_Api_Key,
            "projectName" => $Dinger_projectName,
            "merchantName" => $Dinger_merchantName,
        ));

        $publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFD4IL1suUt/TsJu6zScnvsEdLPuACgBdjX82QQf8NQlFHu2v/84dztaJEyljv3TGPuEgUftpC9OEOuEG29z7z1uOw7c9T/luRhgRrkH7AwOj4U1+eK3T1R+8LVYATtPCkqAAiomkTU+aC5Y2vfMInZMgjX0DdKMctUur8tQtvkwIDAQAB-----END PUBLIC KEY-----';

        try
        {
            // $invoice = new Invoice();
            // $invoice->user_id = $user_id;
            // $invoice->merchant_order_id = $merchant_order_id;
            // $invoice->save();

            $rsa = new RSA();
            extract($rsa->createKey(1024));
            $rsa->loadKey($publicKey); // public key
            $rsa->setEncryptionMode(2);
            $ciphertext = $rsa->encrypt($data_pay);
            $value = base64_encode($ciphertext);

            $urlencode_value = urlencode($value);

            $encryptedHashValue = hash_hmac('sha256', $data_pay,$Dinger_Secret_Key);

            $redirect_url = "$Dinger_BaseUrl/?hashValue=$encryptedHashValue&payload=$urlencode_value";
        }
        catch (\Throwable $th)
        {
            return $this->handleError('error', $th);
        }
        return $this->handleResponse(['url' => $redirect_url], 'data success!');
    }
}
}
