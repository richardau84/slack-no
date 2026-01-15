export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Optional: Verify Slack token
        const slackToken = req.body.token;
        if (process.env.SLACK_VERIFICATION_TOKEN && slackToken !== process.env.SLACK_VERIFICATION_TOKEN) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Call the naas API
        const response = await fetch('https://naas.isalman.dev/no');
        const data = await response.json();
        const reason = data.reason;

        // Respond to Slack
        return res.json({
            response_type: 'in_channel',
            text: reason
        });

    } catch (error) {
        console.error('Error:', error);
        
        return res.json({
            response_type: 'ephemeral',
            text: 'Sorry, I couldn\'t get a reason right now. Please try again later.'
        });
    }
}
