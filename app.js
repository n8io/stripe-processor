require('dotenv-safe').load({silent: true});

const stripeAccoutKey = process.env.STRIPE_SECRET_KEY;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const express = require('express');
const stripe = require('stripe')(stripeAccoutKey);
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const pj = require('./package.json');
const app = express();

const info = chalk.cyan;
const error = chalk.red;
const success = chalk.green;

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('views', './views')
app.set('view engine', 'jade');

app
  .get('/config', getConfig)
  .get('/', getIndex)
  .post('/api/stripe/payment', postPayment)
  ;

const server = app.listen(port, host, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log(info(`${pj.name}@${pj.version} running on ${host}:${port}`));
});

function getConfig(req, res) {
  return res.json({
    serviceRatePercent: parseFloat(process.env.STRIPE_TRANSACTION_RATE, 10),
    serviceFlatFee: parseFloat(process.env.STRIPE_TRANSACTION_FLAT_FEE, 10)
  });
}

function getIndex(req, res) {
  return res.render('index');
}

function postPayment(req, res) {
  // Get the credit card details submitted by the form
  const paymentData = parsePaymentData(req.body);
  const chargeInfo = {
    amount: paymentData.amount, // amount in cents, again
    currency: paymentData.currency,
    source: paymentData.token,
    description: paymentData.description,
    receipt_email: paymentData.email,
    metadata: {
      email: paymentData.email
    }
  };

  if (paymentData.customer) {
    chargeInfo.metadata.customerFirstName = paymentData.customer.firstName;
    chargeInfo.metadata.customerLastName = paymentData.customer.lastName;
  }

  const charge = stripe.charges.create(chargeInfo, function(err, charge) {
    if (err) {
      console.log(error(JSON.stringify(err, null, 2)));

      return res.status(500).send('Sorry. Could not process your payment at this time.');
    }

    return res.status(200).json({message: 'OK'});
  });
}

function parsePaymentData(body) {
  const data = {
    token: null
  };

  const props = [,
    { key: 'email', default: null },
    { key: 'amount', default: 0 },
    { key: 'currency', default: 'usd' },
    { key: 'token', default: null },
    { key: 'description', default: '' },
    { key: 'customer', default: null }
  ];

  if (body) {
    props.forEach(function(p) {
      data[p.key] = body[p.key] || p.default;
    });
  }

  return data;
}
