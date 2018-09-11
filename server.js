const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// heroku setup for the port, OR when we run app locally will run over port 3000
const port = process.env.PORT || 3000;

var app = express();

// registerPartial allows us to save the same code into files
//   eg. header, footer codes
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// Using Middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    // if we never include the next(), the rest of 
    //    the code will never execute
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

app.use((req, res, next) => {
    res.render('maintenance.hbs', {
       pageTitle: 'Maintenance Page'
    });
});

// static directory
app.use(express.static(__dirname + '/public'))

// helper functions allow us to avoid repeating the same code
hbs.registerHelper('getCurrentYear', () => {
    // this will autometically update the year so we dont have to 
    //   manually update in our footer
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

/* ROUTES SETUP */
app.get('/', (req, res) => {
    // response.send('<h1>Hello Express!</h1>');
    // we can also send json data
    // response.send({
    //     name: 'Amrit',
    //     likes: [
    //         'eating',
    //         'playing soccer'
    //     ]
    // });

    // render static page 'home.hbc'
    res.render('home.hbs', {
        welcomeMessage: 'Welcome to the homepage',
        pageTitle: 'Home Page',  
    });
});

app.get('/about', (req, res) => {
    // res.send('<h3>About Page</h3>');
    // rendering static page 'about.hbs'
    res.render('about.hbs', {
        // data passed in to about.hbs
       pageTitle: 'About Page',  
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});