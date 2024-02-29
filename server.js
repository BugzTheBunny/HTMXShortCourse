import express from "express";

const app = express()

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Handle GET requests
app.get('/users' , async (req,res) => {

    const limit = +req.query.limit || 10;

    const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
    const users = await response.json();

    res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
        ${users.map((user) => `<li>${user.id} ${user.name}</li>`).join('')}
    </ul>
    `)
});


// Handle POST request for temp conversion
app.post('/convert', (req,res) => {
    setTimeout(() => {
        const fahrenheit = parseFloat(req.body.fahrenheit);
        const celsius = (fahrenheit - 32) * (5/9);

        res.send(`
        <p>${fahrenheit} Fahrenheit degrees is ${celsius} Celsius degrees</p>
        `)
    },2000)
})

let counter = 0;
// Handle GET request for polling.
app.get('/poll', (req,res) => {

    counter++;

    const data = {data:counter}

    res.json(data);
})


// Handle GET request for weather.
let currentTemperature = 20;
app.get('/get-temperature', (req,res) => {
    currentTemperature += Math.random() * 2 - 1; // random temp change

    res.send(currentTemperature.toFixed(1) + "°C")
});



// Handle POST request for user search.
const contacts = [
    {name:"John",email:"John@gmail.com"},
    {name:"Tom",email:"Tom@gmail.com"},
    {name:"Bob",email:"Bob@gmail.com"},
    {name:"Slava",email:"Slava@gmail.com"},
    {name:"Mazuz",email:"Mazuz@gmail.com"},
    {name:"Sally",email:"Sally@gmail.com"},

]
app.post('/search',(req,res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send('<tr></tr>')
    }

    const searchResults = contacts.filter(contact => {
        const name = contact.name.toLowerCase();
        const email = contact.email.toLowerCase();

        return (
            name.includes(searchTerm) || email.includes(searchTerm)
        )
    });

    setTimeout(() => {
        const searchResultHtml = searchResults.map(contact => `
        <tr>
            <td><div class="my-4 p-2">${contact.name}</td>
            <td><div class="my-4 p-2">${contact.email}</td>
        </tr>
        `).join('');

        res.send(searchResultHtml);
    },1000);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})