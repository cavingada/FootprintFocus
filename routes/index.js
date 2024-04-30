

import calculateRoutes from './calculations.js';

const constructorMethod = (app) => {
    app.use('/', calculateRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
}

export default constructorMethod;