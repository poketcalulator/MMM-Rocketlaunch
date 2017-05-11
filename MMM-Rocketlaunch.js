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
		refreshInterval: 1000 * 15,
		updateInterval: 1000 * 3600,
		timeFormat: config.timeFormat,
		lang: config.language,
		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 1000,
		apiBase: 'https://launchlibrary.net/1.2/launch?next=4&mode=verbose',
		missionlong: 1,

		//  status	Integer (1 Green, 2 Red, 3 Success, 4 Failed)
		statusTable: {
			"1": "Green Status",
			"2": "Red Status",
			"3": "Launch Success",
			"4": "Launch Failed!"
		},


	},



	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "font-awesome.css"];
	},


	// Load CSS
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

		// Exit if no data
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
			table.className = "small thin light";

					// row 1
					var row = document.createElement("tr");
					table.appendChild(row);

					// row 1, cell 1 rocketname and config label
					var lwslcell = document.createElement("td");
					lwslcell.className = "fa fa-rocket";
					//lwslcell.className = "title bright";
					row.appendChild(lwslcell);

					// row 1, cell 2 rocketname and config
					var lwstcell = document.createElement("td");
					lwstcell.innerHTML = currentLaunche.rocketconfig
					lwstcell.className = "rheader";
					row.appendChild(lwstcell);

					table.appendChild(row);

			// row 3
			var row = document.createElement("tr");
			table.appendChild(row);

				// Launche Window start / end label
				var lwelcell = document.createElement("td");
				lwelcell.className = "fa fa-clock-o";
				// lwelcell.className = "title bright";
				row.appendChild(lwelcell);

				// Launche Window start / end data
				var lwedcell = document.createElement("td");
				lwedcell.innerHTML = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss")
						+ " <i class='fa fa-arrows-h' aria-hidden='true'></i> "
						+ moment(currentLaunche.windowend).format("DD-MM-YYYY HH:mm:ss");

				// lwedcell.className = "time light";
				row.appendChild(lwedcell);

				// row 4
				var row = document.createElement("tr");
				table.appendChild(row);

					// row 4, cell 1 - launchsite label
					var lslcell = document.createElement("td");
					lslcell.className = "fa fa-globe";
					// lslcell.className = "title bright";
					row.appendChild(lslcell);

					// row 4, cell 2 - launchsite data
					var lsdcell = document.createElement("td");
					lsdcell.innerHTML = currentLaunche.launchsite;
					lsdcell.colSpan = 2;
					// lsdcell.className = "time light";
					row.appendChild(lsdcell);

				// row 5
				var row = document.createElement("tr");
				table.appendChild(row);

						// Status label
						var rclcell = document.createElement("td");
						rclcell.className = "fa fa-check-square-o";
						// rclcell.className = "title bright";
						row.appendChild(rclcell);

						// Status data
						var rcdcell = document.createElement("td");
						rcdcell.innerHTML = this.config.statusTable[currentLaunche.status];
						// rcdcell.colSpan = 2;
						// rcdcell.className = "time light";
						row.appendChild(rcdcell);

				// row 6
				var row = document.createElement("tr");
				table.appendChild(row);

						// mission name label
						var mnlcell = document.createElement("td");
						// mnlcell.innerHTML = "Mission Name:";
						mnlcell.className = "fa fa-info";
						row.appendChild(mnlcell);

						// row 6, cell 2 - mission name data
						var mndcell = document.createElement("td");
						mndcell.innerHTML = currentLaunche.payloadname + " (" + currentLaunche.payloadtype + " payload)<br><br>";
						// mndcell.colSpan = 2;
						// mndcell.className = "time light";
						row.appendChild(mndcell);

/*
				// row 8
				//if (this.config.mission == 1) {
				var row = document.createElement("tr");
				table.appendChild(row);

						// row 8, cell 1 - mission description data
						var mddcell = document.createElement("td");
						mddcell.innerHTML = currentLaunche.missiondesc + "<br><br>";
						mddcell.colSpan = 2;
						// mddcell.className = "time light";
						row.appendChild(mddcell);
				// }
*/
				wrapper.appendChild(table);
		}

		wrapper.appendChild(table);

		return wrapper;
	},


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
