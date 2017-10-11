const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const stripe = require('stripe')('sk_test_0TLPK3m3L9JlhItOLqGkgzE4');

//Set Express App Variable
const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Set Static folder
app.use(express.static(`${__dirname}/public`));

//Index route
app.get('/', (req, res) => {
  res.render('index');
});

//Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(
      customer => {
        console.log(customer);
        stripe.charges.create({
          amount,
          description: 'Web Development Ebook',
          currency: 'usd',
          customer: customer.id
        })
        .then(charge => console.log(charge))
      }
    )
    .then(charge => {
      console.log(charge);
      res.render('success');
    });
});

//PORT
const port = process.env.PORT || 5000;

//Start Server
app.listen(port, () => {
  console.log("Server starting...");
  setTimeout(() => {
    console.log(`Server started on port ${port}`);
  }, 800);
});