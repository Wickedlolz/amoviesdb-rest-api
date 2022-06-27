const express = require('express');
const { port } = require('./src/config/constants');
const initDb = require('./src/config/mongoose');
const routes = require('./src/config/routes');

init();

async function init() {
    await initDb();
    const app = express();
    require('./src/config/express')(app);
    app.use(routes);

    app.listen(port, () =>
        console.log(`[server]: Server is running on port: ${port}`)
    );
}
