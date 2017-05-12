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
		apiBase: 'https://launchlibrary.net/1.2/launch?next=',
		apiParmVerbose: '&mode=verbose',
		missiondesc: true,
		launches: "1",

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

			// ## Create table ##
			var table = document.createElement("table");
			table.className = "small thin light";

					// Add row 1
					var row = document.createElement("tr");
					table.appendChild(row);

					// row 1, cell 1 rocketname and config label
					var lwslcell = document.createElement("th");
					lwslcell.innerHTML = "<i class='fa fa-rocket' aria-hidden='true'></i>";
					lwslcell.className = "rhicon";
					row.appendChild(lwslcell);

					// row 1, cell 2 rocketname and config
					var lwstcell = document.createElement("th");
					lwstcell.innerHTML = moment(currentLaunche.windowstart).format("D MMM") +
					" - " + currentLaunche.rocketconfig;
					lwstcell.className = "rhtext";
					row.appendChild(lwstcell);

					table.appendChild(row);

			// row 3
			var row = document.createElement("tr");
			table.appendChild(row);

				// Launche Window start / end label
				var lwelcell = document.createElement("td");
				lwelcell.innerHTML = "<i class='fa fa-clock-o' aria-hidden='true'></i>";
				lwelcell.className = "ricon";
				row.appendChild(lwelcell);

				// Launche Window start / end data
				var lwedcell = document.createElement("td");
				lwedcell.innerHTML = moment(currentLaunche.windowstart).format("DD-MM-YYYY HH:mm:ss") +
				 " <i class='fa fa-arrows-h' aria-hidden='true'></i> " +
				 moment(currentLaunche.windowend).format("DD-MM-YYYY HH:mm:ss");
				lwedcell.className = "rtext";
				row.appendChild(lwedcell);

				// row 4
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

					// row 4AA
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

						// row 4BB
						var row = document.createElement("tr");
						table.appendChild(row);

							//  Agencies icon
							var aicell = document.createElement("td");
							aicell.innerHTML = "<i class='fa fa-sitemap' aria-hidden='true'></i>";
							aicell.className = "ricon";
							row.appendChild(aicell);

							// Agencies data
							var agencietext = "";

							for (var a in currentLaunche.agencies) {
								var currentAgencie = currentLaunche.agencies[a];
								agencietext = agencietext + currentAgencie.name + "<br>";
							}
							var adcell = document.createElement("td");
							adcell.innerHTML = agencietext;
							adcell.className = "rtext";
							row.appendChild(adcell);

				// row 5
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

				// row 6
				var row = document.createElement("tr");
				table.appendChild(row);

						// mission name label
						var mnicell = document.createElement("td");
						mnicell.innerHTML = "<i class='fa fa-info-circle' aria-hidden='true'></i>";
						mnicell.className = "ricon";
						row.appendChild(mnicell);

						// mission name data
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

				var row = document.createElement("tr");
				table.appendChild(row);

						// empty cell1
						var emptycell1 = document.createElement("td");
						// emptycell1.innerHTML = "";
						emptycell1.className = "empty";
						row.appendChild(emptycell1);

						// empty cell2
						var emptycell2 = document.createElement("td");
						// emptycell2.innerHTML = "";
						emptycell2.className = "empty";
						row.appendChild(emptycell2);

				wrapper.appendChild(table);
		}

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
				launchsite: r.location.name,
				launchpad: r.location.pads[0].name,
				agencies: r.location.pads[0].agencies,
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
