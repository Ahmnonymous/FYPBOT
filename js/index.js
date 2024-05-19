const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library



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
const secretKey = process.env.SECRET_KEY || 'default_secret_key';

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
// Login Api
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ userName: username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.userName }, secretKey, { expiresIn: '1h' });

        // Send token in response
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while logging in' });
    }
});



// Change Password
app.post('/changepassword', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { username } = jwt.decode(req.token);

        // Find the user by username
        const user = await User.findOne({ userName: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the current password with the stored hashed password
        const passwordMatch = await bcrypt.compare(currentPassword, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.Password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/user', verifyToken, async (req, res) => {
    try {
        const { username } = jwt.decode(req.token);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            username: user.username,
        });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/login', (req, res) => {
    res.redirect('login.html');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});