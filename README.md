# MMM-Rocketlaunch

This an module for the [MagicMirror](https://github.com/MichMich/MagicMirror).

The module lists scheduled rocket launches, and various information regarding a launche.

Information about rocket name and configuration, launch time, location, launchepad, agency, status, payload, mission description.


## Example
![Example](https://github.com/poketcalulator/MMM-Rocketlaunch/blob/master/Example/Example01.png)
![Example](https://github.com/poketcalulator/MMM-Rocketlaunch/blob/master/Example/Example02.png)

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
        missiondesc: false        
      }
  },
  ````

  ## Config Options

  |Option|Default|Description|
  |:---|:---:|:---|
  |`launches`|REQUIRED|Control the number of returned launches. 1-5 is a good place to start as the data is filling up, more is possible but probably not very practical.|
  |`missiondesc`|REQUIRED|With or without long mission description. **true** Mission description. **false** No mission description.|

  ## Credits
  - To Michael Teeuw (https://magicmirror.builders)

  ## Base API
  This Modul is using the [https://launchlibrary.net](https://launchlibrary.net/1.2/docs/api.html#tippitytop)
