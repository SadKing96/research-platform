
const fetchCloudflareMetrics = async () => {
    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/zones/0ceea8569d9aa2fa4bf2e17650eb9501/analytics/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer oQj8YPwIeLIGVp9aRuDEWknw_rofEXABIPGh0FFB',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
};

fetchCloudflareMetrics();
