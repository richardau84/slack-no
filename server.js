const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (from Slack)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Slack No Plugin is running!' });
});

// Slack slash command endpoint
app.post('/slack/no', async (req, res) => {
    try {
        // Verify the request is from Slack (optional but recommended)
        const slackToken = req.body.token;
        if (process.env.SLACK_VERIFICATION_TOKEN && slackToken !== process.env.SLACK_VERIFICATION_TOKEN) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Call the naas API
        const response = await axios.get('https://naas.isalman.dev/no');
        const reason = response.data.reason;

        // Respond to Slack with the reason
        res.json({
            response_type: 'in_channel', // Makes the response visible to everyone in the channel
            text: reason
        });

    } catch (error) {
        console.error('Error calling naas API:', error);
        
        // Send error message back to Slack
        res.json({
            response_type: 'ephemeral', // Only visible to the user who ran the command
            text: 'Sorry, I couldn\'t get a reason right now. Please try again later.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
