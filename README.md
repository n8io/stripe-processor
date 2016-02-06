# stripe-processor
A simple, but flexible web app to process a payment using the Stripe API.

![The Kitchen Sink](/stripe-payment.png)

## Getting started

1. `npm install`
1. `cat .env.example > .env`
1. In the `.env` file, enter the required Stripe info
1. `npm run start`
1. open [http://localhost:3000/?a=100&n=Hello%20World!&d=A%20short%20description%20here](http://localhost:3000/?a=100&n=Hello%20World!&d=A%20short%20description%20here)

## Options
Available query string parameters:
```
{
  a: 'The amount in pennies. Must be a whole number. Required. E.g., $30 would be 3000',
  n: 'The title you would like to give the payment. Required. E.g. September Golf Trip',
  d: 'The short description you would like to give the payment. Optional. E.g. Robert Trent Jones Golf Trail',
  e: 'The email in which you want to send a receipt to. Optional. E.g. test@test.com',
  i: 'The url for the payment icon. Optional. E.g. https://my.cdn.com/tiger-woods.jpg',
  b: 'The background url for the payment page. Optional. E.g. https://my.cdn.com/the-masters.jpg',
  o: 'The flag that specifies if the amount should add the Stripe transaction fees to the total amount or not. Optional. Default: false'
}
```
The 'b' parameter can also be a valid hex color if you prefer a monochrome background other than the default white. E.g. b=ff0 or b=F9F9F9.

The kitchen sink example. The resulting page output is shown at the top of this page.
[The Kitchen Sink](http://localhost:3000/?&b=http://goo.gl/oS7JcT&c=USD&o=false&n=September%20Golf%20Trip&d=Robert%20Trent%20Jones%20Golf%20Trail&f=Nate&l=Clark&a=49999&i=http://goo.gl/n5dbYn)
