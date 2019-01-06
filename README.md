# Module: Calendar [Monthly]

The `calendar_monthly` module is a simple month-view calendar created for the MagicMirror project
by Michael Teeuw (https://github.com/MichMich/MagicMirror). The modules refreshes its timer every
hour however it will only update the calendar display once a day, at midnight.

## Installing the module
Clone this repository in your `~/MagicMirror/modules/` folder `( $ cd ~MagicMirror/modules/ )`:
````javascript
git clone https://github.com/KirAsh4/calendar_monthly
````

## Using the module
To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
			{
				module: 'calendar_monthly',
				position: 'top_left',
				config: {
						// The config property is optional
						// Without a config, a default month view is shown
						// Please see the 'Configuration Options' section for more information
				}
			}
]
````

## Configuration options
The `calendar_monthly` module has several optional properties that can be used to change its behaviour:

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Description</th>
			<th>Default</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<th colspan="3"><em>More options may get added later.</em></th>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<td><code>fadeSpeed</code></td>
			<td>How fast <strong>(in seconds)</strong> to fade out and back in at the midnight refresh</td>
			<td><code>2</code> seconds</td>
		</tr>
		<tr>
			<td><code>showHeader</code></td>
			<td>This allows you to turn on or off the header on the calendar.
			    The header consists of the month and year.</td>
			<td><code>true</code> - Other option is <code>false</code>.</td>
		</tr>
		<tr>
			<td><code>cssStyle</code></td>
			<td>Calendar_monthly allows you to use a custom CSS to style your calendar, or
			    you can use one of the built-in ones. Please read the 'CSS Styling'
				section for more information.</td>
			<td><code>block</code> - Other options are <code>slate</code>, and <code>custom</code>. Others
			    may be added in the future. Please note that the <code>slate</code> style is designed for mirror-less displays.</td>
		</tr>
		<tr>
			<td><code>updateDelay</code></td>
			<td>How long <strong>(in seconds)</strong> to wait before refreshing the calendar at midnight<br />
			    This is primarily done in case there are other modules also triggering at exactly midnight.
				This allows the user to set a delay so the calendar won't refresh at the same time.</td>
			<td><code>5</code> seconds</td>
		</tr>
	</tbody>
</table>

## Custom CSS Styling
The `calendar_monthly` module creates a table that contains the various elements of the calendar. Most of
the relevant elements are tagges with either a <code>class</code> or <code>id</code> making it possible
for anyone to make changes to the default styling.

The full element tree is as follows:
````javascript
<table id="calendar-table">
  <thead>
    <tr>
	  <th id="calendar-th">
	    <span id="monthName">[month name]</span>
		<span id="yearDigits">[4 digit year]</span>
	  </th>
	</tr>
  </thead>
  
  <tfoot>
    <tr id="calender-tf">
	  <td class="footer"> </td>
	</tr>
  </tfoot>
  
  <tbody>
    <tr id="calendar-header">
	  <td class="calendar-header-day">[day name]</td>
	  /* Repeat above line 7 times for each day of the week, Sun/Mon/Tue/etc. */
	  /* ... */
	</tr>
	<tr class="weekRow">
	  <td class="calendar-day">
	    <div class="square-box">
		  <div class="square-content">
		    <div>
			  <span [class="... read Note #1 below ..."]>[date number]</span>
			</div>
		  </div>
		</div>
	  </td>
	  /* Repeat above block 7 days, once for each day */
	  /* ... */
	 </tr>
	 /* Repeat above block as many times as there are weeks in the month */
	 /* ... */
  </tbody>
</table>
````

Note #1:
If the date being displayed is:
- from the previous month, the *class* name will be <code>monthPrev</code>
- from the next month, the *class* name will be <code>monthNext</code>
- the current day, the *class* name will be <code>today</code>
- any other day of the month, the *class* name will be <code>daily</code>

To create your own styling, navigate to the `modules/calendar_monthly/` folder and open the file called
<code>styleCustom.css</code>. Take a look at the various elements already defined and start
playing with them.

**Hint:** It's useful to set your <code>cssStyle</code> to <code>custom</code> and see what that
looks like before you start making changes. This will serve as a reference when you're looking at
the CSS file.
