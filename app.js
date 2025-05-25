const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

const API_URL = 'https://afghan-proverbs-api-pt1q.onrender.com/proverbs';


app.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        const response = await axios.get(`${API_URL}${category ? '?category=' + category : ''}`);
        res.render('index', { proverbs: response.data });
    } catch (error) {
        console.error('Error loading proverbs:', error.message);
        res.status(500).send('Failed to load proverbs.');
    }
});


app.get('/proverbs/:id', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/${req.params.id}`);
        res.render('show', { proverb: response.data });
    } catch (error) {
        res.status(500).send('Proverb not found.');
    }
});


app.get('/add', (req, res) => {
    res.render('add');
});


app.post('/proverbs', async (req, res) => {
    try {
        await axios.post(API_URL, req.body);
        res.redirect('/');
    } catch (error) {
        res.status(400).send('Failed to add proverb.');
    }
});

// Form to edit existing proverb
app.get('/proverbs/:id/edit', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/${req.params.id}`);
        res.render('edit', { proverb: response.data });
    } catch (error) {
        res.status(500).send('Failed to load proverb.');
    }
});

// Update proverb
app.put('/proverbs/:id', async (req, res) => {
    try {
        await axios.put(`${API_URL}/${req.params.id}`, req.body);
        res.redirect(`/proverbs/${req.params.id}`);
    } catch (error) {
        res.status(400).send('Failed to update proverb.');
    }
});

// Delete proverb
app.delete('/proverbs/:id', async (req, res) => {
    try {
        await axios.delete(`${API_URL}/${req.params.id}`);
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Failed to delete proverb.');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Frontend running on http://localhost:${PORT}`);
});
