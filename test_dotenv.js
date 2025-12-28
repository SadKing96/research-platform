import 'dotenv/config';
console.log('TOKEN:', process.env.CLOUDFLARE_API_TOKEN ? 'Loaded' : 'Missing');
console.log('ZONE:', process.env.CLOUDFLARE_ZONE_ID ? 'Loaded' : 'Missing');
console.log('PORT:', process.env.PORT);
