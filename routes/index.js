//Here you will import route files and export them as used in previous labs

import calculateRoutes from './calculations.js';

const constructorMethod = (app) => {
    app.use('/', calculateRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}

export default constructorMethod;