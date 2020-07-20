
# Payment Service 

# Service Overview
Payment Service is a microservice written in NodeJS using ExpressJS, MongoDB as Database, mongoose ORM & using PayPal Simple Client integration in the Frontend. This service has a separate database that stores user info like _id i.e, unique identification of a user and record of every transaction like successful, canceled, failed, etc. 


Payment service has a Payment model that takes every successful and unsuccessful payment and saves to our database. Payment  Service enables Users to buy Ideas through Paypal. This service is positioned as a phase before making a request to save the idea in Orders Service as a history of previous orders for a user. A User can have a list of ideas as “History”


![Paypal-steps](url-to-image)


This service starts when a user clicks on the button ( Paypal button ) in Cart service after checkout and Paypal Client Integration script starts working :

1) The script starts: the user clicks the button.
2) The button calls PayPal Orders API to set up a transaction.
3) The button launches the PayPal Checkout experience. It will open a pop-up of Paypal authentication. If a user is already / previously authenticated he is redirected directly to the final payment step where he can choose how to buy from his PayPal account. If a user is successfully authenticated from the PayPal authorization phase is completed 
4) The user approves the payment.
5) The button calls PayPal Orders API to finalize the transaction.
6) Show the confirmation to your buyer.


If a user cancels the pop-up of authentication or If a user doesn’t pay after authentication,  it is treated as a canceled transaction.  Which can trigger a onCancel Function( )


If as user successfully makes a payment a onSuccess Function( ) is triggered.

If any error occurs onError Function ( ) is triggered. Error occurs when
```bash
The main Paypal's script cannot be loaded or somethings block the loading of that script.

Because the Paypal's main script is loaded asynchronously from https://www.paypalobjects.com/api/checkout.js

Sometimes it may take about 0.5 seconds for everything to get set, or for the button to appear
```

These onSuccess and onCancel request make a POST request to the backend service of Payment service which stores all the details coming from PayPal API & request.

For successful requests, PayPal returns HTTP 2XX status code. For failed requests, PayPal returns HTTP 4XX or 5XX status codes.
## Paypal Configuration:
```bash
let env = "sandbox";  //Set to 'production' for production
let currency = "USD";
let total = this.props.toPay;  // This is the total amount (based on currency) to be paid by using Paypal express checkout
```
### Paypal's currency code: 
https://developer.paypal.com/docs/classic/api/currency_codes/

For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):

https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
### For production app-ID:
https://developer.paypal.com/docs/classic/lifecycle/goingLive/
 
### Error Responses from Paypal:
```JSON
{  "name": "ERROR_NAME",
 "message": "Error message.",
  "debug_id": "debug_ID",
  "details": { "field": "field_name",
      		"value": "value_passed",
      		"location": "field_location",
      		"issue": "problem_with_field",
"description": "Error description."
},
  "links":
    {
      "https://error_documentation_link",
      "rel": "information_link",
      "encType": "application/json"
      }
}      
      
```

### Data Comming from PayPal API:
## If cancelled:
```JSON
Object :
paymentToken: String,
paymentID : String,
Intent: String,
billingID : String,
cancelUrl: String,
Button_version : String
```
## If Success:
```JSON
Object :
Paid:true,
Cancelled: false,
paymentToken: String,
paymentID : String,							
intent: String,
billingID : String,
email: String,
returnUrl: String,
Address: Object of Address of Paypal User
Button_version: String
```
### Payment Model:
```
{
"user": { type: Array , default : [ ] } ,
"data": { type: Array, default : [ ] },
 "product": {  type: Array, default: [ ] },
"createdAt": { type: Date, default : Date.now }
}
```

### Installation:

Clone this repository into your local
```bash
git clone https://github.com/Ravilochan/payment-service.git
```
Go to that directory
```bash
cd <directory-name>
```
Install all Dependencies for Node to run. You need to have Node, npm already installed in your computer to run this command
```bash
npm install
```
### Run Service:
To Run this service your system or Local should have NodeJS installedInstalled. 
This starts the service on http://localhost:7000 on your computer
```bash
npm start
```
or you can start this service by command :
```bash
node api/index
```
## Backend API Endpoints :
This Service has API endpoints at
```
/api/payment --> POST Request

/api/allPayments --> GET Request

/api/allSuccess --> GET Request

/api/allCancelled --> GET Request

/api/allError --> GET Request

```
### For /api/payment - POST Request:
Data sending to Request in the body should be like
```JSON
{ 
"user":
     {
     "_id":"5d6ede6a0ba62570afcedd3b"
     },
"cartDetails":
     {
     "_id":"5d6ede6a0ba62570afcedd32",
     "idea_owner": "String",
     "idea_owner_name": "String2",
     "idea_genre": "String3",
     "idea_headline": "String idea_name",
     "idea_description": "String idea_description",
     "price": 50
     },
"paymentData":
     {
     "paid":"true",
     "cancelled": "false",
     "paymentToken": "String2",
     "paymentID  ": "String3",
     "intent": "String",
     "billingID ": "5d6ede6a0ba62570afcedd32",
     "email": "xyz@gamil.com",
     "address":
     { "recipient_name": "John Doe",
       "line1": "1 Main St",
       "city": "San Jose",
       "state": "CA",
       "postal_code": "95131",
       "country_code": "US"
     }
     },
		"type":"Success",
}
```
Here the _id in user is the MongoDB UID / _id unique for every user. This should be 12 characters and unique and according to the rules of MongoDB _id. Here the _id in the cart is the MongoDB UID / _id unique for every Idea. 
This should be 12 characters and unique and according to the rules of MongoDB _id. 

### Response :
```JSON
{
    "success":true,
    "_id": "5d6ede6a0ba62570afcedd3b",
    "__v": 0
}
```
### For /api/allPayment - GET Request:
To Get all the payments in the payment service including all Successful , failed and error payments.

Request:
```bash
localhost:7001/api/allPayments
```
Response :
```JSON
{
    "allPayments": [
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                }
            ],
            "_id": "5f15c2bc2c8a94474c1f4140",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paymentToken": "EC-6HS38133FF879593B",
                "paymentID": "PAYID-L4K4FNA2YN76130W6345370G",
                "intent": "sale",
                "billingID": "EC-6HS38133FF879593B",
                "cancelUrl": "https://www.paypal.com/checkoutnow/error?token=EC-6HS38133FF879593B",
                "button_version": "2.1.98",
                "type": "cancelled"
            },
            "createdAt": "2020-07-20T16:13:48.294Z",
            "__v": 0
        },
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                }
            ],
            "_id": "5f15da5d2c8a94474c1f4141",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paymentToken": "EC-9KK579519Y976630S",
                "paymentID": "PAYID-L4K5T5I90550358UU238605U",
                "intent": "sale",
                "billingID": "EC-9KK579519Y976630S",
                "cancelUrl": "https://www.paypal.com/checkoutnow/error?token=EC-9KK579519Y976630S",
                "button_version": "2.1.98",
                "type": "cancelled"
            },
            "createdAt": "2020-07-20T17:54:37.765Z",
            "__v": 0
        },
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                },
                {
                    "_id": "5d6ede6a0ba62570afcedd38",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 150
                }
            ],
            "_id": "5f15da9b2c8a94474c1f4142",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paid": true,
                "cancelled": false,
                "payerID": "YQ7V3AQGL5SEA",
                "paymentID": "PAYID-L4K5VBI2NP00822ED857160D",
                "paymentToken": "EC-1PB69426WX770035Y",
                "returnUrl": "https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L4K5VBI2NP00822ED857160D&token=EC-1PB69426WX770035Y&PayerID=YQ7V3AQGL5SEA",
                "address": {
                    "recipient_name": "John Doe",
                    "line1": "1 Main St",
                    "city": "San Jose",
                    "state": "CA",
                    "postal_code": "95131",
                    "country_code": "US"
                },
                "email": "sb-m472yz2540845@personal.example.com",
                "type": "Success"
            },
            "createdAt": "2020-07-20T17:55:39.689Z",
            "__v": 0
        }
    ]
}
```
### For /api/allSuccess - GET Request:
To get all payments which are only successful

Request:
```bash
localhost:7001/api/allSuccess
```
Response :
```JSON
{
    "success": [
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                },
                {
                    "_id": "5d6ede6a0ba62570afcedd38",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 150
                }
            ],
            "_id": "5f15da9b2c8a94474c1f4142",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paid": true,
                "cancelled": false,
                "payerID": "YQ7V3AQGL5SEA",
                "paymentID": "PAYID-L4K5VBI2NP00822ED857160D",
                "paymentToken": "EC-1PB69426WX770035Y",
                "returnUrl": "https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L4K5VBI2NP00822ED857160D&token=EC-1PB69426WX770035Y&PayerID=YQ7V3AQGL5SEA",
                "address": {
                    "recipient_name": "John Doe",
                    "line1": "1 Main St",
                    "city": "San Jose",
                    "state": "CA",
                    "postal_code": "95131",
                    "country_code": "US"
                },
                "email": "sb-m472yz2540845@personal.example.com",
                "type": "Success"
            },
            "createdAt": "2020-07-20T17:55:39.689Z",
            "__v": 0
        }
    ]
}
```

### For /api/allCancelled - GET Request:
To get all payments which are only cancelled

Request:
```bash
localhost:7001/api/allCancelled
```
Response :
```JSON
{
    "Cancelled": [
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                }
            ],
            "_id": "5f15c2bc2c8a94474c1f4140",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paymentToken": "EC-6HS38133FF879593B",
                "paymentID": "PAYID-L4K4FNA2YN76130W6345370G",
                "intent": "sale",
                "billingID": "EC-6HS38133FF879593B",
                "cancelUrl": "https://www.paypal.com/checkoutnow/error?token=EC-6HS38133FF879593B",
                "button_version": "2.1.98",
                "type": "Cancelled"
            },
            "createdAt": "2020-07-20T16:13:48.294Z",
            "__v": 0
        },
        {
            "product": [
                {
                    "_id": "5d6ede6a0ba62570afcedd39",
                    "idea_owner": "String",
                    "idea_owner_name": "String2",
                    "idea_genre": "String3",
                    "idea_headline": "String idea_name",
                    "idea_description": "String idea_description",
                    "price": 50
                }
            ],
            "_id": "5f15da5d2c8a94474c1f4141",
            "user": "5d6ede6a0ba62570afcedd3a",
            "data": {
                "paymentToken": "EC-9KK579519Y976630S",
                "paymentID": "PAYID-L4K5T5I90550358UU238605U",
                "intent": "sale",
                "billingID": "EC-9KK579519Y976630S",
                "cancelUrl": "https://www.paypal.com/checkoutnow/error?token=EC-9KK579519Y976630S",
                "button_version": "2.1.98",
                "type": "Cancelled"
            },
            "createdAt": "2020-07-20T17:54:37.765Z",
            "__v": 0
        }
    ]
}
```
### For /api/allError - GET Request:
To get all payments which are only Error

Request:
```bash
localhost:7001/api/allError
```
Response :
```JSON
{
    "Error": []
}
```
