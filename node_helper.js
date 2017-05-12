'use strict';

/* Magic Mirror
 * Module: MMM-Rocketlaunch
 *
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

	// Now pull the data from the API launchlibrary.net
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
				// console.log(body);
				self.sendSocketNotification("DATA", body);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.refreshInterval);
	},



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
