/* Magic Mirror Module: calendar_monthly
 * v1.0 - June 2016
 *
 * By Ashley M. Kirchner <kirash4@gmail.com>
 * Beer Licensed (meaning, if you like this module, feel free to have a beer on me, or send me one.)
 */

 Module.register("calendar_monthly", {

	// Module defaults
	defaults: {
		debugging:			false,
		initialLoadDelay:	0,
		fadeSpeed:			2,			// How fast to fade out and in during a midnight refresh
		showHeader:			true,		// Show the month and year at the top of the calendar
		cssStyle:			"block",	// which CSS style to use, 'clear', 'block', 'slate', or 'custom'
		updateDelay:		5,			// How many seconds after midnight before a refresh
										// This is to prevent collision with other modules refreshing
										// at the same time.
	},

	// Required styles
	getStyles: function() {
		return [this.data.path + "/css/mcal.css", this.getThemeCss()];
	},

	// return css path for theme css style
	getThemeCss: function() {
		return this.data.path + "/css/themes/" + this.config.cssStyle + ".css";
	},

	// Required scripts
	getScripts: function() {
		return ["moment.js"];
	},

	// Override start method
	start: function() {
		Log.log("Starting module: " + this.name);
		// Set locale
		moment.locale(config.language);

		// Calculate next midnight and add updateDelay
		var now = moment();
		this.midnight = moment([now.year(), now.month(), now.date() + 1]).add(this.config.updateDelay, "seconds");

		this.loaded = false;

		this.scheduleUpdate(this.config.initialLoadDelay);
	},

	// Override dom generator
	getDom: function() {

		if ((moment() > this.midnight) || (!this.loaded)) {

			var month = moment().month();
			var year = moment().year();
			var monthName = moment().format("MMMM");
			var monthLength = moment().daysInMonth();

			// Find first day of the month, LOCALE aware
			var startingDay = moment().date(1).weekday();

			var wrapper = document.createElement("table");
			wrapper.className = 'xsmall';
			wrapper.id = 'calendar-table';

			// Create THEAD section with month name and 4-digit year
			var header = document.createElement("tHead");
			var headerTR = document.createElement("tr");

			// We only fill in the THEAD section if the .showHeader config is set to true
			if (this.config.showHeader) {
				var headerTH = document.createElement("th");
				headerTH.colSpan = "7";
				headerTH.scope = "col";
				headerTH.id = "calendar-th";
				var headerMonthSpan = document.createElement("span");
				headerMonthSpan.id = "monthName";
				headerMonthSpan.innerHTML = monthName;
				var headerYearSpan = document.createElement("span");
				headerYearSpan.id = "yearDigits";
				headerYearSpan.innerHTML = year;
				// Add space between the two elements
				// This can be used later with the :before or :after options in the CSS
				var headerSpace = document.createTextNode(" ");

				headerTH.appendChild(headerMonthSpan);
				headerTH.appendChild(headerSpace);
				headerTH.appendChild(headerYearSpan);
				headerTR.appendChild(headerTH);
			}
			header.appendChild(headerTR);
			wrapper.appendChild(header);

			// Create TFOOT section -- currently used for debugging only
			var footer = document.createElement('tFoot');
			var footerTR = document.createElement("tr");
			footerTR.id = "calendar-tf";

			var footerTD = document.createElement("td");
			footerTD.colSpan ="7";
			footerTD.className = "footer";
			if (this.config.debugging) {
				footerTD.innerHTML = "Calendar currently in DEBUG mode!<br />Please see console log.";
			} else {
				footerTD.innerHTML = "&nbsp;";
			}

			footerTR.appendChild(footerTD);
			footer.appendChild(footerTR);
			wrapper.appendChild(footer);

			// Create TBODY section with day names
			var bodyContent = document.createElement("tBody");
			var bodyTR = document.createElement("tr");
			bodyTR.id = "calendar-header";

			for (var i = 0; i <= 6; i++ ){
				var bodyTD = document.createElement("td");
				bodyTD.className = "calendar-header-day";
				bodyTD.innerHTML = moment().weekday(i).format("ddd");
				bodyTR.appendChild(bodyTD);
			}
			bodyContent.appendChild(bodyTR);
			wrapper.appendChild(bodyContent);

			// Create TBODY section with the monthly calendar
			var bodyContent = document.createElement("tBody");
			var bodyTR = document.createElement("tr");
			bodyTR.className = "weekRow";

			// Fill in the days
			var day = 1;
			var nextMonth = 1;
			// Loop for amount of weeks (as rows)
			for (var i = 0; i < 9; i++) {
				// Loop for each weekday (as individual cells)
				for (var j = 0; j <= 6; j++) {
					var bodyTD = document.createElement("td");
					bodyTD.className = "calendar-day";
					var squareDiv = document.createElement("div");
					squareDiv.className = "square-box";
					var squareContent = document.createElement("div");
					squareContent.className = "square-content";
					var squareContentInner = document.createElement("div");
					var innerSpan = document.createElement("span");

					if (j < startingDay && i == 0) {
						// First row, fill in empty slots
						innerSpan.className = "monthPrev";
						innerSpan.innerHTML = moment().subtract(1, 'months').endOf('month').subtract((startingDay - 1) - j, 'days').date();
					} else if (day <= monthLength && (i > 0 || j >= startingDay)) {
						if (day == moment().date()) {
							innerSpan.id = "day" + day;
							innerSpan.className = "today";
						} else {
							innerSpan.id = "day" + day;
							innerSpan.className = "daily";
						}
						innerSpan.innerHTML = day;
						day++;
					} else if (day > monthLength && i > 0) {
						// Last row, fill in empty space
						innerSpan.className = "monthNext";
						innerSpan.innerHTML = moment([year, month, monthLength]).add(nextMonth, 'days').date();
						nextMonth++;
					}
					squareContentInner.appendChild(innerSpan);
					squareContent.appendChild(squareContentInner);
					squareDiv.appendChild(squareContent);
					bodyTD.appendChild(squareDiv);
					bodyTR.appendChild(bodyTD);
				}
				// Don't need any more rows if we've run out of days
				if (day > monthLength) {
					break;
				} else {
					bodyTR.appendChild(bodyTD);
					bodyContent.appendChild(bodyTR);
					var bodyTR = document.createElement("tr");
					bodyTR.className = "weekRow";
				}
			}

			bodyContent.appendChild(bodyTR);
			wrapper.appendChild(bodyContent);

			this.loaded = true;
			return wrapper;

		}

	},

	scheduleUpdate: function(delay) {
		if (this.config.debugging) {
			Log.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
			Log.log("CALENDAR_MONTHLY IS IN DEBUG MODE!");
			Log.log("Remove 'debugging' option from config/config.js to disable.");
			Log.log("             Current moment(): " + moment() + " (" + moment().format("hh:mm:ss a") + ")");
			Log.log("scheduleUpdate() delay set at: " + delay);
		}

		if (typeof delay !== "undefined" && delay >= 0) {
			nextReload = delay;
		}

		if (delay > 0) {
			// Calculate the time DIFFERENCE to that next reload!
			nextReload = moment.duration(nextReload.diff(moment(), "milliseconds"));
			if (this.config.debugging) {
				var hours = Math.floor(nextReload.asHours());
				var  mins = Math.floor(nextReload.asMinutes()) - hours * 60;
				var  secs = Math.floor(nextReload.asSeconds()) - ((hours * 3600 ) + (mins * 60));
				Log.log("  nextReload should happen at: " + delay + " (" + moment(delay).format("hh:mm:ss a") + ")");
				Log.log("                  which is in: " + mins + " minutes and " + secs + " seconds.");
				Log.log("              midnight set at: " + this.midnight + " (" + moment(this.midnight).format("hh:mm:ss a") + ")");
				Log.log("= = = = = = = = = = = = = = = = = = = = = = = = = = = = = =");
			}
		}

		var self = this;
		setTimeout(function() {
			self.reloadDom();
		}, nextReload);

	},

	reloadDom: function() {
		if (this.config.debugging) {
			Log.log("          Calling reloadDom()!");
		}

		var now = moment();
		if (now > this.midnight) {
			this.updateDom(this.config.fadeSpeed * 1000);
			this.midnight = moment([now.year(), now.month(), now.date() + 1]).add(this.config.updateDelay, "seconds");
		}

		var nextRefresh = moment([now.year(), now.month(), now.date(), now.hour() + 1]);
		this.scheduleUpdate(nextRefresh);
	}

});
