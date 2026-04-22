const http = require('http');

const adminPages = [
  '/admin',
  '/admin/homepage',
  '/admin/about',
  '/admin/research',
  '/admin/team',
  '/admin/projects',
  '/admin/publications',
  '/admin/facilities',
  '/admin/contact',
  '/admin/navigation',
  '/admin/settings'
];

const options = {
  hostname: 'localhost',
  port: 3002,
  method: 'GET',
  headers: {
    'Accept': 'text/html'
  }
};

function testAdminPage(path) {
  return new Promise((resolve) => {
    const req = http.request({ ...options, path }, (res) => {
      resolve(`${path}: ${res.statusCode} ${res.statusMessage}`);
    });
    
    req.on('error', (error) => {
      resolve(`${path}: ERROR - ${error.message}`);
    });
    
    req.end();
  });
}

async function testAdminPages() {
  console.log('Testing admin pages...');
  console.log('==================================');
  
  const results = await Promise.all(adminPages.map(testAdminPage));
  results.forEach(result => console.log(result));
  
  console.log('==================================');
  console.log('Testing complete!');
}

testAdminPages();
