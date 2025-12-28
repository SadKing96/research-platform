
const fetchCloudflareMetrics = async () => {
    const apiToken = 'oQj8YPwIeLIGVp9aRuDEWknw_rofEXABIPGh0FFB';
    const zoneId = '0ceea8569d9aa2fa4bf2e17650eb9501';

    const query = `
      query {
        viewer {
          zones(filter: { zoneTag: "${zoneId}" }) {
            httpRequests1dGroups(limit: 1) {
               date { date }
               sum {
                 pageViews
               }
            }
          }
        }
      }
    `;

    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        if (data.errors) {
            console.log("ERRORS:", JSON.stringify(data.errors, null, 2));
        } else {
            console.log("SUCCESS:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("EXCEPTION:", err);
    }
};

fetchCloudflareMetrics();
