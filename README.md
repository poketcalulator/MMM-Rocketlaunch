# MMM-Rocketlaunch
# V 1.5

This an module for the [MagicMirror](https://github.com/MichMich/MagicMirror).

The module lists scheduled rocket launches, and various information regarding a launche.

Information about rocket name and configuration, launch time, location, launchepad, agency, status, payload, mission description, vessel image.


## Example
![Example](https://github.com/poketcalulator/MMM-Rocketlaunch/blob/master/Example/Example03.png)

## Installation
Open a terminal session, navigate to your MagicMirror's `modules` folder and execute `git clone https://github.com/poketcalulator/MMM-Rocketlaunch.git`, a new folder called MMM-Rocketlaunch will be created.

Complete the installation by adding the following to config.js as shown below.  

## Using the module
````javascript
modules: [
{
      module: 'MMM-Rocketlaunch',
      position: 'top_right',
      header: 'Rocketlaunch',
      config: {
        launches: "2",
        missiondesc: false,
        imggray: true,       
      }
  },
  ````

  ## Config Options

  |Option|Default|Description|
  |:---|:---:|:---|
  |`launches`|REQUIRED|Control the number of returned launches. 1-5 is a good place to start.|
  |`missiondesc`|REQUIRED|With or without long mission description. **true** Mission description will be retrieved. **false** Mission description will not be retrieved. Customize to suit your needs.|
  |`imggray`|REQUIRED|image in grayscale(default) or color. **true** grayscale, **false** in color|

  ## Credits
  - To Michael Teeuw (https://magicmirror.builders)

  ## Base API
  This Modul is using the [https://thespacedevs.com/llapi](https://thespacedevs.com/llapi)
