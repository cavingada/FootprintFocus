import { Router } from 'express';

const router = Router();
import { calculate } from '../data/calculations.js';
import { checkNumberField, checkIfPositive, checkCheckBox } from '../utils/utils.js';

router.route('/').get(async (req, res) => {
    res.render('home');
});

router.route('/calculate').get(async (req, res) => {
    res.redirect('/');
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
    let average = 87.61;
    let isLessThanAverage = carbon < average;
    let amount;
    if (isLessThanAverage)  {
      amount = average - carbon;
    }
    else {
      amount = carbon - average;
    }

    //round to 2 decimal places
    amount = amount.toFixed(2);

    // Pass `isLessThanAverage` to your template
    res.render('results', { carbon, isLessThanAverage, amount });
  }
  catch (e) {
    console.log(e);
    res.status(e[0]).render('home', {error: e[1]});
  }
});


//export router
export default router;
