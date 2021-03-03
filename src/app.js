const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));


// Setup routing
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ryan Driscoll'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ryan Driscoll'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'I hear that you need help with things.',
        title: 'Help',
        name: 'Ryan Driscoll'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address to search.'
        });
    }
    
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                address: req.query.address,
                forecast: forecastData,
                location
            });
        })
    });

    
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        });
    } 

    console.log(req.query.search);
    res.send({
        products: []
    });

});

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help article not found.',
        title: 'Are you lost?',
        name: 'Ryan Driscoll'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page not found.',
        title: 'Are you lost?',
        name: 'Ryan Driscoll'
    });
});

app.listen(port, ()=> {
    console.log(`Server is up on port ${port}`);
});