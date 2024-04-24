const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


const app = express();
const port = process.env.PORT || 3000;


main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Binance');
    console.log('Data Base Connected!');
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const userSchema = new mongoose.Schema({
    userName: String,
    Password: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

// Signup Api
app.post('/signup', async (req, res) => {
    try {
        const userName = req.body.username;
        const plainPassword = req.body.password;
        const email = req.body.email;

        const existingUser = await User.findOne({ userName });
        const existingemail = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with the same userName already exists' });
        } else if (existingemail) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            // Create a new user with the hashed password
            const user = new User({
                userName: userName,
                Password: hashedPassword,
                email: email
            });

            await user.save();
            return res.status(200).json({ message: 'Sign Up successful' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while registering the user' });
    }
});


// Login Api
app.post('/login', async (req, res) => {
    try {
        const userName = req.body.username;
        const plainPassword = req.body.password;

        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(plainPassword, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Send a success response with a redirect URL
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
});
app.get('/login', (req, res) => {
    return res.redirect('LoginPage.html')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});