import fs from 'fs';
const content = "CLOUDFLARE_API_TOKEN=oQj8YPwIeLIGVp9aRuDEWknw_rofEXABIPGh0FFB\nCLOUDFLARE_ZONE_ID=0ceea8569d9aa2fa4bf2e17650eb9501\nPORT=3001";
fs.writeFileSync('.env', content, 'utf8');
console.log('Fixed .env');
