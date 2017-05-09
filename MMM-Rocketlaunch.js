/* global Module */

/* Magic Mirror
 * Module: MMM-Rocketlaunch
 *
 * By John Kristensen
 * MIT Licensed.
 */

Module.register('MMM-Rocketlaunch',{

	defaults: {
		units: config.units,
		animationSpeed: 1000,
		refreshInterval: 1000 * 15, //refresh every minute
		updateInterval: 1000 * 3600, //update every hour
		timeFormat: config.timeFormat,
		lang: config.language,
		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,
		apiBase: 'https://launchlibrary.net/1.2/launch?next=1&mode=verbose',


	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "font-awesome.css"];
	},

	getStyles: function() {
		return ['Rocketlaunch.css'];
	},

	start: function() {
		Log.info('Starting module: ' + this.name);
		this.loaded = false;
		this.sendSocketNotification('CONFIG', this.config);
	},

	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.targetlaunche.length) {
			wrapper.innerHTML = "No data";
			wrapper.className = "dimmed light small";
			return wrapper;
		}





		/*
		var lineHeader = document.createElement("th");
		lineHeader.innerHTML = "Linie";
		lineHeader.className = "rnvheader";
		lineHeader.colSpan = 2;
		row.appendChild(lineHeader);

		var destinationHeader = document.createElement("th");
		destinationHeader.innerHTML = "Fahrtrichtung";
		destinationHeader.className = "rnvheader";
		row.appendChild(destinationHeader);
		table.appendChild(row);
		*/

		// Tabel start
		var table = document.createElement("table");
		// table.id = "rltable";
		// table.className = "small thin light";

		// For each rocket launche
		for (var i in this.targetlaunche) {
			var currentLaunche = this.targetlaunche[i];



			// Header
			rowHD = table.insertRow();  // DOM method for creating table rows
	 		rowHD.insertCell().textContent = moment(currentLaunche.windowstart).format("D MMM");
	 		rowHD.insertCell().textContent = currentLaunche.rocketname + " / " + currentLaunche.rocketconfig;
			rowHD.insertCell().textContent = currentLaunche.status;

			// Launche Windows start
			rowSTA = table.insertRow();
			rowSTA.insertCell().textContent = "Launche Windowstart:";
			rowSTA.insertCell().textContent = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss");
			rowSTA.colSpan = 2;

			// Launche Windows
			rowEND = table.insertRow();
			rowEND.insertCell().textContent = "Launche Windowend:";
			rowEND.insertCell().textContent = moment(currentLaunche.windowend).format("DD-MM-YYYY HH:mm:ss");
			rowEND.colSpan = 2;

			// Launchsite
			rowSITE = table.insertRow();
			rowSITE.insertCell().textContent = "Launche Site:";
			rowSITE.insertCell().textContent = currentLaunche.launchsite;
			rowSITE.colSpan = 2;

			// Mission info
			rowMIS = table.insertRow();
			rowMIS.insertCell().textContent = "Mission: " + currentLaunche.missiondesc;
			rowMIS.colSpan = 3;


			/*

			console.log(moment(currentLaunche.windowstart).format("D MMM"));

			// Local vs UTC time
			// console.log(moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss") + " / " + moment.utc(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss"));


*/


		}
		wrapper.appendChild(table);


		return wrapper;
	},

	/*
	Rocket (launches.0.rocket. name)
	Payload (launches.0.missions.type / launches.0.missions.typeName)
	Launch Site (launches.0.location.name)
	Launch Date/Time (launches.0.windowstart <-> launches.0.windowend)
	T-Countdown (https://www.w3schools.com/howto/howto_js_countdown.asp)
*/


	processLaunches: function(data) {

		if (!data.launches) {
			return;
		}

		this.targetlaunche = [];

		for (var i in data.launches) {

			var r = data.launches[i];

			this.targetlaunche.push({
				rocketname: r.rocket.familyname,
				rocketconfig: r.rocket.configuration,
				payloadname: r.missions[0].name,
				payloadtype: r.missions[0].typeName,
				missiondesc: r.missions[0].description,
				launchsite: r.location.pads[0].name,
				windowstart: r.isostart,
				windowend: r.isoend,
				status: r.status,
				probability: r.probability,
			});
		}
		return;
	},

 	socketNotificationReceived: function(notification, payload) {
    		if (notification === "STARTED") {
				this.updateDom();
			}
			else if (notification === "DATA") {
				this.loaded = true;
				this.processLaunches(JSON.parse(payload));
				this.updateDom();
    		}
	}

});
