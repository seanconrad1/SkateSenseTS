const fs = require('fs');

let updateAppJSON = {};

const data = fs.readFileSync('./app.json', 'utf8');

const result = JSON.parse(data);

const buildNumber = parseInt(result.expo.ios.buildNumber);

result.expo.ios.buildNumber = (buildNumber + 1).toString();

updateAppJSON = result;

try {
  fs.writeFileSync('./app.json', JSON.stringify(updateAppJSON));
  console.log('done!');
  //file written successfully
} catch (err) {
  console.error(err);
}
