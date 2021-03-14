/* global Module */

/* Magic Mirror
 * Module: MMM-Rocketlaunch
 * v 1.5
 * By John Kristensen
 * MIT Licensed.
 */

Module.register('MMM-Rocketlaunch',{

	defaults: {
		units: config.units,
		animationSpeed: 1000,
		// API data is available at no cost for up to 300 requests per day
		refreshInterval: 1000 * 900,
		updateInterval: 1000 * 30,
		timeFormat: config.timeFormat,
		lang: config.language,
		initialLoadDelay: 0,
		retryDelay: 1000,
		// https://thespacedevs.com/llapi
		// https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json
		apiBase: 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=',
		apiParmVerbose: '&format=json',
		missiondesc: true,
		imggray: true,
		launches: "1",

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

			// ## Create table ##
			var table = document.createElement("table");
			table.className = "small thin light";

					// row 1
					var row = document.createElement("tr");
					table.appendChild(row);

					// cell 1 rocketname and config label
					var lwslcell = document.createElement("th");
					lwslcell.innerHTML = "<i class='fa fa-rocket' aria-hidden='true'></i>";
					lwslcell.className = "rhicon";
					row.appendChild(lwslcell);

					// cell 2 rocketname and config data
					var lwstcell = document.createElement("th");
					lwstcell.innerHTML = moment(currentLaunche.windowstart).format("D MMM") +
					" - " + currentLaunche.rocketconfig;
					lwstcell.className = "rhtext";
					row.appendChild(lwstcell);

					table.appendChild(row);

			// row 2
			var row = document.createElement("tr");
			table.appendChild(row);

				// cell 1 launche Window start / end icon
				var lwelcell = document.createElement("td");
				lwelcell.innerHTML = "<i class='fa fa-clock-o' aria-hidden='true'></i>";
				lwelcell.className = "ricon";
				row.appendChild(lwelcell);

				// cell 2 launche Window start / end data
				var lwedcell = document.createElement("td");
				// If star and end window are eq, then there is no launchewindow
				if(currentLaunche.windowstart === currentLaunche.windowend){
					lwedcell.innerHTML = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss");
				} else {
					lwedcell.innerHTML = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss") +
					 " <i class='fa fa-arrows-h' aria-hidden='true'></i> " +
					 moment(currentLaunche.windowend).format("DD-MM-YYYY HH:mm:ss");
				}
				lwedcell.className = "rtext";
				row.appendChild(lwedcell);

				// row 3
				var row = document.createElement("tr");
				table.appendChild(row);

					// Launchsite icon
					var lslcell = document.createElement("td");
					lslcell.innerHTML = "<i class='fa fa-globe' aria-hidden='true'></i>";
					lslcell.className = "ricon";
					row.appendChild(lslcell);

					// Launchsite data
					var lsdcell = document.createElement("td");
					lsdcell.innerHTML = currentLaunche.launchsite;
					lsdcell.className = "rtext";
					row.appendChild(lsdcell);

				// row 4
				var row = document.createElement("tr");
				table.appendChild(row);

					// Launchpad icon
					var lpicell = document.createElement("td");
					lpicell.innerHTML = "<i class='fa fa-map-marker' aria-hidden='true'></i>";
					lpicell.className = "ricon";
					row.appendChild(lpicell);

					// Launchpad data
					var lpdcell = document.createElement("td");
					lpdcell.innerHTML = currentLaunche.launchpad;
					lpdcell.className = "rtext";
					row.appendChild(lpdcell);

				// row 5
				var row = document.createElement("tr");
				table.appendChild(row);

							//  Agencies icon
							var aicell = document.createElement("td");
							aicell.innerHTML = "<i class='fa fa-sitemap' aria-hidden='true'></i>";
							aicell.className = "ricon";
							row.appendChild(aicell);

							// Agencies data
							var adcell = document.createElement("td");
							adcell.innerHTML = currentLaunche.agencies;
							adcell.className = "rtext";
							row.appendChild(adcell);

				// row 6
				var row = document.createElement("tr");
				table.appendChild(row);

						// Status icon
						var sicell = document.createElement("td");
						sicell.innerHTML = "<i class='fa fa-check-circle-o' aria-hidden='true'></i>";
						sicell.className = "ricon";
						row.appendChild(sicell);

						// Status data
						var sdcell = document.createElement("td");
						sdcell.innerHTML = this.config.statusTable[currentLaunche.status];
						sdcell.className = "rtext";
						row.appendChild(sdcell);

				// row 7
				var row = document.createElement("tr");
				table.appendChild(row);

						// mission payload/name + type label
						var mnicell = document.createElement("td");
						mnicell.innerHTML = "<i class='fa fa-info-circle' aria-hidden='true'></i>";
						mnicell.className = "ricon";
						row.appendChild(mnicell);

						// mission payload/name + type data
						var mndcell = document.createElement("td");
						mndcell.innerHTML = currentLaunche.payloadname + " (" +
						currentLaunche.payloadtype + " payload)";
						mndcell.className = "rtext";
						row.appendChild(mndcell);


				// row 8
				if (this.config.missiondesc) {

				var row = document.createElement("tr");
				table.appendChild(row);

						// Missions description icon
						var mdicell = document.createElement("td");
						mdicell.innerHTML = "<i class='fa fa-file-text' aria-hidden='true'></i>";
						mdicell.className = "ricon";
						row.appendChild(mdicell);

						// Missions description data
						var mddcell = document.createElement("td");
						mddcell.innerHTML = currentLaunche.missiondesc;
						mddcell.className = "rtext";
						row.appendChild(mddcell);
				}

				// row 9
				if (currentLaunche.image) {

				var row = document.createElement("tr");
				table.appendChild(row);

						// image icon
						var piccell1 = document.createElement("td");
						piccell1.innerHTML = "<i class='fa fa-camera' aria-hidden='true'></i>";
						piccell1.className = "ricon";
						row.appendChild(piccell1);

						// image
						var piccell2 = document.createElement("td");
						piccell2.innerHTML = "<img src='" + currentLaunche.image + "'>";
						if (this.config.imggray) {
							piccell2.className = "imggray";
						} else {
							piccell2.className = "imgcolor";
						}
						row.appendChild(piccell2);
				}

				// row 10
				var row = document.createElement("tr");
				table.appendChild(row);

						// empty cell1 / control the distance
						var emptycell1 = document.createElement("td");
						emptycell1.className = "empty";
						row.appendChild(emptycell1);

						// empty cell1 / control the distance
						var emptycell2 = document.createElement("td");
						emptycell2.className = "empty";
						row.appendChild(emptycell2);

				wrapper.appendChild(table);
		}

		return wrapper;
	},


	processLaunches: function(data) {

		if (!data.results) {
			return;
		}

		this.targetlaunche = [];

		for (var i in data.results) {

			var r = data.results[i];

			this.targetlaunche.push({
				rocketname: r.rocket.configuration.name,
				rocketconfig: r.rocket.configuration.full_name,
				payloadname: r.mission.name,
				payloadtype: r.mission.type,
				missiondesc: r.mission.description,
				launchsite: r.pad.location.country_code,
				launchpad: r.pad.location.name,
				agencies: r.launch_service_provider.name,
				windowstart: r.window_start,
				windowend: r.window_end,
				status: r.status.id,
				image: r.image,
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
