//import express, express router as shown in lecture code
import express from 'express';
import { loginValidate, registerValidate } from '../helpers.js';
import { loginUser, registerUser } from '../data/users.js';


const router = express.Router();

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/protected');
    }
  }
  else {
    return res.redirect('/login');
  }
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    //render view of registration form
    if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/protected');
      }
    }
    else {
      res.render('register');
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const { firstNameInput, lastNameInput, emailAddressInput, passwordInput, confirmPasswordInput, roleInput } = req.body;

    // Check if all fields are supplied
    const missingFields = [];
    if (!firstNameInput) missingFields.push('First Name');
    if (!lastNameInput) missingFields.push('Last Name');
    if (!emailAddressInput) missingFields.push('Email Address');
    if (!passwordInput) missingFields.push('Password');
    if (!confirmPasswordInput) missingFields.push('Confirm Password');
    if (!roleInput) missingFields.push('Role');

    if (missingFields.length > 0) {
        return res.status(400).render('register', { error: `Missing field(s): ${missingFields.join(', ')}` });
    }
    
    if (passwordInput !== confirmPasswordInput) {
        return res.status(400).render('register', { error: 'Passwords do not match' });
    }

    let check;
    try {
        check = registerValidate(firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput);
    }
    catch (e) {
        return res.status(400).render('register', { error: e });
    }
    if (check !== true) {
        return res.status(400).render('register', { error: check });
    }

    try {
        const user = await registerUser(firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput);
        if (user.insertedUser) { 
          return res.status(200).redirect('/login');
        }
        else {
          return res.status(500).render('register', { error: 'Internal Server Error' });
        } 
    }
    catch (e) {
        if (e === 'Internal Server Error') {
            return res.status(500).render('register', { error: e });
        }
        else {
            return res.status(400).render('register', { error: e });
        }
    }

  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    //render view of login form
    if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/protected');
      }
    }
    else {
      res.render('login');
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const { emailAddressInput, passwordInput } = req.body;

    // Check if all fields are supplied
    const missingFields = [];
    
    if (!emailAddressInput) missingFields.push('Email Address');
    if (!passwordInput) missingFields.push('Password');

    if (missingFields.length > 0) {
        return res.status(400).render('login', { error: `Missing field(s): ${missingFields.join(', ')}` });
    }

    let check;

    try {
        check = loginValidate(emailAddressInput, passwordInput);
    }
    catch (e) {
        return res.status(400).render('login', { error: e });
    }

    if (check !== true) {
        return res.status(400).render('login', { error: check });
    }

    try {
      const user = await loginUser(emailAddressInput, passwordInput);
      if (user) {
          req.session.user = {
              firstName: user.firstName,
              lastName: user.lastName,
              emailAddress: user.emailAddress,
              role: user.role
          };

          if (user.role === 'admin') {
              return res.status(200).redirect('/admin');
          } else {
              return res.status(200).redirect('/protected');
          }
      } else {
          return res.status(400).render('login', { error: 'Invalid email address and/or password' });
      }
    } catch (e) {
        return res.status(400).render('login', { error: e });
    }

  });

router.route('/protected').get(async (req, res) => {
  //code here for GET
  if (req.session && req.session.user) {
    const { firstName, lastName, role } = req.session.user;
    const currentTime = new Date().toLocaleString();

    let isAdmin = false;
    if (role === 'admin') {
        isAdmin = true;
    }

    return res.status(200).render('protected', {
        firstName,
        lastName,
        currentTime,
        role,
        isAdmin
    });
  } else {
      return res.status(403).redirect('/error');
  }
});

router.route('/admin').get(async (req, res) => {
  //code here for GET
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    const { firstName, lastName } = req.session.user;
    const currentTime = new Date().toLocaleString();

    return res.status(200).render('admin', {
        firstName,
        lastName,
        currentTime
    });
  } else {
    return res.status(403).redirect('/error');
  }
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  const errorMessage = "You do not have permission to view this page";
  return res.status(403).render('error', { error: errorMessage });
});

router.route('/logout').get(async (req, res) => {
  //code here for GET
  if (req.session.user) {
    req.session.destroy();
    return res.render('logout');
  } else {
      return res.redirect('/login');
  }
});

export default router;