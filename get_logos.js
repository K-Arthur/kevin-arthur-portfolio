const fs = require('fs');
const https = require('https');

const logos = [
  { name: 'nvidia.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
  { name: 'who.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/WHO_logo.svg' },
  { name: 'gates-foundation.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Bill_%26_Melinda_Gates_Foundation_logo.svg' },
  { name: 'imperial-college.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Imperial_College_London_logo.svg' }
];

logos.forEach(logo => {
  https.get(logo.url, (res) => {
    const file = fs.createWriteStream(`public/images/logos/${logo.name}`);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${logo.name}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${logo.name}:`, err.message);
  });
});
