# Detective Dollar

# Installation guide and setup
First, install NodeJS. You can download NodeJS for all platforms [here](
https://nodejs.org/en/download)

To preview the app on your own mobile device install the [**Expo Go**](https://expo.dev/client) app

Clone the [Detective Dollar Repository](https://github.com/RazrSlyr/DetectiveDollar) to a desired location using:
```
git clone https://github.com/RazrSlyr/DetectiveDollar.git
or
git clone git@github.com:RazrSlyr/DetectiveDollar.git
``` 
Next open your local repo in the terminal or command line and install the package dependencies using

```
npx expo install
```
Once all the packages have been installed, you can run a development build of the app by using
```
npx expo start
```
You can preview the app by setting up Android Studio or Xcode. 
Or you can preview the app on your device by scanning the QR code on the [**Expo Go**](https://expo.dev/client) Android App or Scanning the QR Code with the camera app on IOS.

# ESLint Setup and Prettier setup for VS Code
You can read about it [here](https://docs.expo.dev/guides/using-eslint/)

Step 2-3 should already be complete

Just install eslint config

```
npm install eslint prettier eslint-config-universe --save-dev
```

Also install [EsLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) Extension 

Takes some time to load, may meed to reload project


### Automatically Format a file
Once everything is set up, use
```
Ctrl/Cmd  + Shift + p
``` 
to bring up command list in VS Code

Type Eslint and click on ESLint: Fix all Auto Fixable problems

or just quick fix the highlighted issue
     