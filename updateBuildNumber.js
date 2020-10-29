const fs = require('fs');

let updateAppJSON = {};

const data = fs.readFileSync('./app.json', 'utf8');

const result = JSON.parse(data);

const IOSbuildNumber = parseInt(result.expo.ios.buildNumber);
const AndroidbuildNumber = result.expo.android.versionCode;

result.expo.ios.buildNumber = (IOSbuildNumber + 0.1).toString();
result.expo.android.versionCode = AndroidbuildNumber + 1;

updateAppJSON = result;

try {
  fs.writeFileSync('./app.json', JSON.stringify(updateAppJSON));
  console.log('done!');
  //file written successfully
} catch (err) {
  console.error(err);
}
