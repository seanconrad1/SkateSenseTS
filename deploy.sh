#! /usr/bin/env bash
#https://blog.expo.io/automating-standalone-expo-app-builds-and-deployments-with-fastlane-exp-and-exptool-9b2f5ad0a2cd

set -e # exit entire script when command exits with non-zero status

npm install

export DELIVER_USERNAME="test"
export DELIVER_PASSWORD="test"
export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="test"

node ./updateBuildNumber.js

expo publish --release-channel production --non-interactive


# ANDROID
# Start building standalone android build using `production` release channel
#expo build:android --release-channel production --non-interactive --no-publish

# Download the built android binary
#curl -o app.apk "$(expo url:apk --non-interactive)"

#fastlane supply --track 'production' --json_key '<path/to/json_key.json>' --package_name "<your-package-name>" --apk "app.apk" --skip_upload_metadata --skip_upload_images --skip_upload_screenshots

#ANDROID END


#IOS
curl -o app.ipa "$(expo url:ipa --non-interactive)"
expo build:ios --release-channel production --non-interactive --no-publish

fastlane deliver --verbose --ipa "app.ipa" --skip_screenshots --skip_metadata --username "seanconrad123@gmail.com" --team_id "119738131"
#IOS END
