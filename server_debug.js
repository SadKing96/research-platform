import 'dotenv/config';

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;

console.log(`Debug: Token: ${apiToken ? 'Yes' : 'No'}, Zone: ${zoneId}`);

const query = `
      query {
        viewer {
          zones(filter: { zoneTag: "${zoneId.trim()}" }) {
            httpRequests1dGroups(limit: 1) {
               date { date }
               sum {
                 pageViews
                 uniqueVisitors
               }
            }
          }
        }
      }
    `;

async function test() {
    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken.trim()}`
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error);
    }
}

test();
