//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import { Router } from 'express';

const router = Router();
import { calculate } from '../data/calculations.js';
import { checkNumberField, checkIfPositive, checkCheckBox } from '../utils/utils.js';

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
    res.render('home');
});

router.route('/calculate').post(async (req, res) => {

  let electric = req.body.electric_bill;
  let gas = req.body.gas_bill;
  let car = req.body.car_mileage;
  let s_flight = req.body.short_flight;
  let l_flight = req.body.long_flight;
  let recycle_n = req.body.recycle_newspaper;
  let recycle_a = req.body.recycle_aluminum;

  // validation of inputs using helper functions from utils.js  
  try{

    electric = await checkNumberField(electric, 'Electric Bill');
    gas = await checkNumberField(gas, 'Gas Bill');
    car = await checkNumberField(car, 'Car Mileage');
    electric = await checkIfPositive(electric, 'Electric Bill');
    gas = await checkIfPositive(gas, 'Gas Bill');
    car = await checkIfPositive(car, 'Car Mileage');
    s_flight = await checkCheckBox(s_flight, 'Short Flight');
    l_flight = await checkCheckBox(l_flight, 'Long Flight');
    recycle_n = await checkCheckBox(recycle_n, 'Recycle Newspaper');
    recycle_a = await checkCheckBox(recycle_a, 'Recycle Aluminum');

    // print
    // console.log(electric, gas, car, s_flight, l_flight, recycle_n, recycle_a);
    const carbon = await calculate(electric, gas, car, s_flight, l_flight, recycle_n, recycle_a);
    res.render('results', {carbon: carbon});
  }
  catch (e) {
    console.log(e);
    res.status(e[0]).render('error', {error: e[1]});
  }
});


//export router
export default router;
