# SDE-Angular-Generic
This app is written using the Ionic Framework, which leverages the Kinvey AngularJS libraries to communicate with the backend.

This app demonstrates the following functionality.
Authentication with KinveyAuth or Mobile Identity Connect.  It is possible to show changing the identity provider on the backend to connect to different authentication systems without changing a single line of code on the client.
Interfacing with the Kinvey Datastore.  The products collection contains a list of Kinvey products for sales people to showcase to their customers.  The Datastore can be created on the fly on the backend, data can be imported, and that data is immediately available within the app.  With the product collection you can show GET and GET by query.  Elsewhere in the app, we can also show INSERT (on a different collection).
Offline access.  Once the products collection is imported, you can put your device in airplane mode and show that the data is still accessible and searchable while offline.  On various tabs, you can also show autogeneration of records and syncing to the backend/
Filestore - you can put PDF and other file content in the filestore and see them streamed to the client.  FIXME:  Currently, if you open a file, you have to close the app and reopen.  Unlike in the browser, that view doesn't have a back button.
accounts collection - show importing the data and then "flip the switch" to either SFDC, REST, SQL Server, or (with a little BL) SAP.
tasks Collection - Import data and then you can show, can connect to sharepoint

You may have to reinstall your cordova plugins:
- cordova plugin rm org.apache.cordova.console
- cordova plugin add cordova-plugin-console
- cordova plugin rm org.apache.cordova.device
- cordova plugin add cordova-plugin-device
- cordova plugin rm com.ionic.keyboard
- cordova plugin add ionic-plugin-keyboard
- cordova plugins list
- cordova plugin rm com.phonegap.plugins.PushPlugin
- ionic build ios
- ionic platform remove ios
- ionic platform add ios


It is possible that you might need to install an earlier version of the ios platform.  Try the standard cordova platform add ios first, but if that yirlds failures, try:
ionic platform add ios@3.9.2


You may need to modify your plist file to give permissions for unsecure http traffic and/or for giving permissions to access device geo capabilities:
```
<key>NSAppTransportSecurity</key>
<dict>
<key>NSAllowsArbitraryLoads</key><true/>
</dict>
<key>NSLocationAlwaysUsageDescription</key>
<string>Your message goes here</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Your message goes here</string>
```

