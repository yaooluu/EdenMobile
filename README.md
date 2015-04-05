**EdenMobile**
===========

Application prototype for Sahana Eden framework.

The following instructions describe how to install the application.  
There are two options for running.  It can be run completely in the browser, or an app can be built.  

**Running in the browser**
======================
There is a restriction for browsers that the application must be run from the same server as 
Eden is running in.  It is easiest to run the application within the Eden source tree.

1. Go to the 'static' subdirectory of the Eden source.
  ```
  cd path-to-server-source/web2py/applications/eden/static
  ```

2. Check out the application source code.
  ```
  git clone https://github.com/tombaker1/EdenMobile.git
  ```
If you are planning to also build the cordova app then you may want to put it 
under another directory name such as:
  ```
  git clone https://github.com/tombaker1/EdenMobile.git EdenMobile-source
  ```
3. Set the default server url.  The url is at line 30 of www/config.js.  The default is set to demo.eden.sahanafoundation.org.  It should be set to the url of your local server such as:
  ```
    defaults: {
        url: "http://localhost:8000/eden",
  ```

4. From your browser bring up the main page 
http://*web2py-server-path*/eden/static/EdenMobile/www/index.html.
If you changed the directory name from the default then replace EdenMobile with the name that you used.

5.  Youw will now want to set your user name and password.  That isn't required for viewing entries, but you need to use the user name and password that you have for the server to modify any entries.  Select the 'Settings' page, and enter your user name, and password. 

6. That is it.  Go back to the main page and view other content 
such as 'Shelters'.

**Creating the application**
======================
The app is built using the Cordova/Phonegap web runtime.  Phonegap is a distribution 
of Cordova.  Either one should work.  I use Cordova 
CLI (Command Line Interface) on a Linux Mint system so it has not been tested with Phonegap.

1. First you need to install Cordova, and all of its dependencies including Node.js.  The 
instructions are 
here: http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface.  It 
is best if you read that whole page to become familiar with Cordova.  You only need to do  the 
section **Installing the Cordova CLI**.  I will give instructions for the rest.

2. You must have downloaded the EdenMobile source code.  If you have not 
done so already do steps 1 and 2 in the previous section. Do the second option 
of cloning it to a different directory name.  If you already downloaded the source 
code to the default directory name then rename it.

3.  Create the Cordova application.  
The trick here is to use the --copy-from option to load the source from the alternate directory.  The 
directory that you are creating cannot exist before you run the create command.  Run the 
following command from the .../eden/static directory.  
  ```
  cordova create EdenMobile "org.sahanafoundation.EdenMobile" "EdenMobile" --copy-from ./EdenMobile-source
  ```

4.  The cordova command copies everything except the .git folder.  You need this.  Copy it now.
  ``` 
  cp -r EdenMobile-source/.git EdenMobile 
  ```

5.  Create the platforms that you want to build.  I test on Android.
  ``` 
  cd EdenMobile
  cordova platform add android 
  ```

6.  Build the application. 
  ``` 
  cordova build android 
  ```

7. To run the application on an Android device you need to install the Android SDK.  Make 
sure that the tools are in the PATH environment variable.
http://developer.android.com/sdk/installing/index.html?pkg=adt

8.  Connect a device and make sure that it recognized as an android test device.
  ``` 
  adb devices
  ```

9.  Install and run the devices.  Cordova will rebuild the package by default.
  ``` 
  cordova run android
  ```

10.  The default server is demo.sahanafoundation.org.  It should download the data from 
there.  Use step 3 in the previous
section to change to a different server.
