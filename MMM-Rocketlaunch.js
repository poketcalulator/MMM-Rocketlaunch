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
		refreshInterval: 1000 * 60, //refresh every minute
		updateInterval: 1000 * 3600, //update every hour
		timeFormat: config.timeFormat,
		lang: config.language,
		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,
		apiBase: 'https://launchlibrary.net/1.2/launch?next=2&mode=verbose',

		//  status	Integer (1 Green, 2 Red, 3 Success, 4 Failed)

		iconTable: {
			"1": "fa fa-thumbs-up",
			"2": "fa fa-thumbs-down",
			"3": "fa fa-rocket",
			"4": "fa fa-exclamation-triangle"
		},


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


		// For each rocket launche
		for (var i in this.targetlaunche) {

			var currentLaunche = this.targetlaunche[i];

			// Create table
			var table = document.createElement("table");
			table.className = "small thin light"; // deco

			table.style.width = "500px";

				// 1th row
				var row = document.createElement("tr");

					// Header row 1, cell 1 - date
					var DateHeader = document.createElement("th");
					DateHeader.innerHTML = moment(currentLaunche.windowstart).format("D MMM");
					DateHeader.className = "darkgraycell";
					row.appendChild(DateHeader);

					// Header row 1, cell 2 - rocketname
					var rnHeader = document.createElement("th");
					rnHeader.innerHTML = currentLaunche.rocketname;
					rnHeader.className = "grayheader";
					row.appendChild(rnHeader);

					// Header row 1, cell 3 - status
					var statusHeader = document.createElement("th");
					statusHeader.className = this.config.iconTable[currentLaunche.status];
					// statusHeader.className = "grayheader";
					row.appendChild(statusHeader);

				table.appendChild(row);

					// row 2
					var row = document.createElement("tr");
					table.appendChild(row);

					// row 2, cell 1 - Launche Windowstart label
					var lwslcell = document.createElement("td");
					lwslcell.innerHTML = "Windowstart:";
					lwslcell.className = "Lable";
					row.appendChild(lwslcell);

					// row 2, cell 2 - Launche Windowstart time
					var lwstcell = document.createElement("td");
					lwstcell.innerHTML = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss");
					lwstcell.colSpan = 2;
					lwstcell.className = "dimmed light small";
					row.appendChild(lwstcell);
					table.appendChild(row);

			// row 3
			var row = document.createElement("tr");
			table.appendChild(row);

				// row 3, cell 1 - Launche Windowend label
				var lwelcell = document.createElement("td");
				lwelcell.innerHTML = "Windowend:";
				lwelcell.className = "Lable";
				row.appendChild(lwelcell);

				// row 3, cell 2 - Launche Windowend time
				var lwedcell = document.createElement("td");
				lwedcell.innerHTML = moment(currentLaunche.windowend).format("DD-MM-YYYY HH:mm:ss");
				lwedcell.colSpan = 2;
				lwedcell.className = "dimmed light small";
				row.appendChild(lwedcell);

				// row 4
				var row = document.createElement("tr");
				table.appendChild(row);

					// row 4, cell 1 - launchsite label
					var lslcell = document.createElement("td");
					lslcell.innerHTML = "Site:";
					lslcell.className = "Lable";
					row.appendChild(lslcell);

					// row 4, cell 2 - launchsite data
					var lsdcell = document.createElement("td");
					lsdcell.innerHTML = currentLaunche.launchsite;
					lsdcell.colSpan = 2;
					lsdcell.className = "dimmed light small";
					row.appendChild(lsdcell);

				// row 5
				var row = document.createElement("tr");
				table.appendChild(row);

						// row 5, cell 1 - configuration label
						var rclcell = document.createElement("td");
						rclcell.innerHTML = "Rocket Config:";
						rclcell.className = "Lable";
						row.appendChild(rclcell);

						// row 5, cell 2 - configuration data
						var rcdcell = document.createElement("td");
						rcdcell.innerHTML = currentLaunche.rocketconfig;
						rcdcell.colSpan = 2;
						rcdcell.className = "dimmed light small";
						row.appendChild(rcdcell);

				// row 6
				var row = document.createElement("tr");
				table.appendChild(row);

						// row 6, cell 1 - mission name label
						var mnlcell = document.createElement("td");
						mnlcell.innerHTML = "Mission Name:";
						mnlcell.className = "Lable";
						row.appendChild(mnlcell);

						// row 6, cell 2 - mission name data
						var mndcell = document.createElement("td");
						mndcell.innerHTML = currentLaunche.payloadname;
						mndcell.colSpan = 2;
						mndcell.className = "dimmed light small";
						row.appendChild(mndcell);

				// row 7
				var row = document.createElement("tr");
				table.appendChild(row);

						// row 7, cell 1 - mission type label
						var mtlcell = document.createElement("td");
						mtlcell.innerHTML = "Mission Type:";
						mtlcell.className = "Lable";
						row.appendChild(mtlcell);

						// row 7, cell 2 - mission type data
						var mtdcell = document.createElement("td");
						mtdcell.innerHTML = currentLaunche.payloadtype;
						mtdcell.colSpan = 2;
						mtdcell.className = "dimmed light small";
						row.appendChild(mtdcell);

				// row 8
				var row = document.createElement("tr");
				table.appendChild(row);

						// row 8, cell 1 - mission description data
						var mddcell = document.createElement("td");
						mddcell.innerHTML = currentLaunche.missiondesc + "<br><br>";
						mddcell.colSpan = 3;
						mddcell.className = "dimmed light small";
						row.appendChild(mddcell);

				wrapper.appendChild(table);
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
				rocketconfig: r.rocket.name,
				payloadname: r.missions[0].name,
				payloadtype: r.missions[0].typeName,
				missiondesc: r.missions[0].description,
				launchsite: r.location.pads[0].name,
				windowstart: r.isostart,
				windowend: r.isoend,
				status: r.status,
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
