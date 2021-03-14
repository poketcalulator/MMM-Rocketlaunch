'use strict';

/* Magic Mirror
 * Module: MMM-Rocketlaunch
 * v 1.5
 * By John Kristensen
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		this.config = null;
	},

	// Now pull the data from the API https://ll.thespacedevs.com
	getData: function() {
		var self = this;
		var retry = true;
		var myUrl = this.config.apiBase + this.config.launches + this.config.apiParmVerbose;
		request({
			url: myUrl,
			method: 'GET',
			headers: {'User-Agent': 'request'}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("DATA", body);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);
	},

/*
	getData: function() {

		var self = this;

		const body = String.raw`{"count":179,"next":"https://ll.thespacedevs.com/2.2.0/launch/upcoming/?format=json&limit=1&offset=1","previous":null,"results":[{"id":"134eb787-244e-4131-8b03-c9fbd0a11efc","url":"https://ll.thespacedevs.com/2.2.0/launch/134eb787-244e-4131-8b03-c9fbd0a11efc/?format=json","slug":"falcon-9-block-5-starlink-20","name":"Falcon 9 Block 5 | Starlink 20","status":{"id":1,"name":"Go for Launch","abbrev":"Go","description":"Current T-0 confirmed by official or reliable sources."},"last_updated":"2021-03-07T12:59:04Z","net":"2021-03-10T02:58:00Z","window_end":"2021-03-10T02:58:00Z","window_start":"2021-03-10T02:58:00Z","probability":null,"holdreason":"","failreason":"","hashtag":null,"launch_service_provider":{"id":121,"url":"https://ll.thespacedevs.com/2.2.0/agencies/121/?format=json","name":"SpaceX","type":"Commercial"},"rocket":{"id":2833,"configuration":{"id":164,"url":"https://ll.thespacedevs.com/2.2.0/config/launcher/164/?format=json","name":"Falcon 9 Block 5","family":"Falcon","full_name":"Falcon 9 Block 5","variant":"Block 5"}},"mission":{"id":1240,"name":"Starlink 20","description":"A batch of 60 satellites for Starlink mega-constellation - SpaceX's project for space-based Internet communication system.","launch_designator":null,"type":"Communications","orbit":{"id":8,"name":"Low Earth Orbit","abbrev":"LEO"}},"pad":{"id":80,"url":"https://ll.thespacedevs.com/2.2.0/pad/80/?format=json","agency_id":121,"name":"Space Launch Complex 40","info_url":null,"wiki_url":"https://en.wikipedia.org/wiki/Cape_Canaveral_Air_Force_Station_Space_Launch_Complex_40","map_url":"http://maps.google.com/maps?q=28.56194122,-80.57735736","latitude":"28.56194122","longitude":"-80.57735736","location":{"id":12,"url":"https://ll.thespacedevs.com/2.2.0/location/12/?format=json","name":"Cape Canaveral, FL, USA","country_code":"USA","map_image":"https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/launch_images/location_12_20200803142519.jpg","total_launch_count":212,"total_landing_count":20},"map_image":"https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/launch_images/pad_80_20200803143323.jpg","total_launch_count":67},"webcast_live":false,"image":"https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/launch_images/falcon2520925_image_20210218213404.png","infographic":null,"program":[]}]}`;

		self.sendSocketNotification("DATA", body);

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);

	},

*/
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG' && self.started == false) {
			self.config = payload;
			self.sendSocketNotification("STARTED", true);
			self.getData();
			self.started = true;
		}
	}
});
