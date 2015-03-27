import express from 'express';
import path from 'path';
import config from 'config';

var app = express();

app.set('views', path.join(__dirname, '..', 'client'));
app.set('view engine', 'jade');

app.use( require('./router') );
app.use(express.static( path.join(__dirname, '..', 'public') ));

app.listen(config.port, () => {
    console.log(`Express server listening on port ${config.port}`);
});