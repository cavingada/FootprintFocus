export const calculate = async (electric, gas, car, s_flight, l_flight, recycle_n, recycle_a) => {
  
  // calculate carbon footprint
  let carbon = 0;

  const num_days_in_year = 365.25;
  const num_days_in_month = num_days_in_year/12;

  carbon += electric * 105/num_days_in_month / 12; // 105 represents the yearly rate, we want to convert to daily
  carbon += gas * 105/num_days_in_month / 12;
  carbon += car * 0.79; // .79 is per mile

  if (s_flight) {
    carbon += 1100;
  }
  if (l_flight) {
    carbon += 4400;
  }
  if (!recycle_n) {
    carbon += 184/365.25;
  }
  if (!recycle_a) {
    carbon += 166/365.25;
  }

  return parseFloat(carbon.toFixed(2));
  
 // calculation source: https://justenergy.com/blog/how-to-calculate-your-carbon-footprint/

};

