const monthFormatter = new Intl.DateTimeFormat("en-us", { month: "long" });
const weekdayFormatter = new Intl.DateTimeFormat("en-us", { weekday: "long" });

const whatsAppMsg =
  "'Hello%20Tours%20en%20Bici%20CDMX!%20I%20would%20like%20to%20schedule%20a%20tour%20for%20%5Bdate%5D.'";
const whatsAppNumber = "5215583333677";
const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${whatsAppMsg}`;
var dates = [];

dates[0] = new Date(); // defaults to today
dates[1] = addDays(dates[0], 31);

let currentDate = 0; // index into dates[]
let previousDate = 1;

let datesBoxes = $(".date-picker-date");
let displayBoxes = $(".date-picker-display");

// sensible default just in case jQuery doesn't kick in
// makes sure that the experience is still usable, and when $(window).width() returns then this letiable is updated to the correct value
let windowWidth = 300;
let colourPickerWidth = 300;

// set up dates
$(document).ready(function () {
  // will work the same the first time as every other
  updateDatePicker();

  // update dates shown to correct dates
  $(datesBoxes[0]).text(getDateString(dates[0]));
  $(datesBoxes[1]).text(getDateString(dates[1]));

  $(displayBoxes[0]).text(
    dates[0].getDate() + " " + monthFormatter.format(dates[0]).slice(0, 3)
  );
  $(displayBoxes[1]).text(
    dates[1].getDate() + " " + monthFormatter.format(dates[1]).slice(0, 3)
  );
});

// add event listeners
$(document).ready(function () {
  // has to be applied each time, as it's removed when calendar is reset
  applyDateEventListener();

  $(".date-picker-date").click(function (e) {
    // if active, toggle picker off and return
    var currentlyActive = $(this).hasClass("active");
    if (currentlyActive) {
      $(this).removeClass("active");
      return;
    }

    $(".date-picker-date").removeClass("active");
    $(this).addClass("active");

    // update currentDate
    previousDate = currentDate;
    currentDate = 0;
    updateDatePicker();
  });

  $("#date-picker-next-month").click(function () {
    changeMonth("Next");
  });

  $("#date-picker-previous-month").click(function () {
    changeMonth("Previous");
  });
});

// called on initialising (set to today) and then every time the month changes or on moving between dates
function updateDatePicker(changeMonth = false) {
  var datePicker = $("#date-picker");
  var curDate = dates[currentDate]; // shorthand

  // check if it needs to update
  // updates if changed month directly (changeMonth) or if switched to other .date-picker-date and month is different (differentMonth)
  var differentMonth = checkChangedMonth();
  if (changeMonth === false && differentMonth === false) {
    return;
  }
  updatePickerMonth();

  // clear out all tr instances other than the header row
  // really just removing all rows and appending header row straight back in
  var headerRow = `
    <tr id="date-picker-weekdays">
      <th>S</th>
      <th>M</th>
      <th>T</th>
      <th>W</th>
      <th>T</th>
      <th>F</th>
      <th>S</th>
    </tr>`;
  // clear all rows
  datePicker.contents().remove();
  datePicker.append(headerRow);

  var todayDate = curDate.getDate();
  var firstOfMonth = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
  var firstWeekday = firstOfMonth.getDay(); // 0-indexed; 0 is Sunday, 6 is Saturday
  var lastMonthToInclude = firstWeekday; // happily, this just works as-is.
  var firstOfNextMonth = addMonths(firstOfMonth, 1);
  var lastOfMonth = addDays(firstOfNextMonth, -1).getDate();

  var openRow = "<tr class='date-picker-calendar-row'>";
  var closeRow = "</tr>";
  var currentRow = openRow;

  // Add in as many of last month as required
  if (lastMonthToInclude > 0) {
    var lastMonthLastDay = addDays(firstOfMonth, -1);
    var lastMonthDays = lastMonthLastDay.getDate();
    var lastMonthStartAdding = lastMonthDays - lastMonthToInclude + 1;
    addToCalendar(lastMonthStartAdding, lastMonthDays, 0, "previous-month");
  }

  // fill out rest of row with current month
  // doesn't matter how many of last month were included, all accounted for
  addToCalendar(1, 7 - lastMonthToInclude, lastMonthToInclude, true);

  // reset for current month generation
  currentRow = openRow;

  var counter = 7;
  var addedFromCurrentMonth = 7 - firstWeekday + 1;

  addToCalendar(addedFromCurrentMonth, lastOfMonth, counter, true);

  // at this point, counter = all of this month + whatever was included from last month
  counter = lastMonthToInclude + lastOfMonth;
  var nextMonthToInclude = counter % 7 === 0 ? 0 : 7 - (counter % 7);

  addToCalendar(1, nextMonthToInclude, counter, "next-month");

  // add event listener again
  applyDateEventListener();

  // update current date box
  updateDateShown();

  function checkChangedMonth() {
    // updates if changed month directly (changeMonth) or if switched to other .date-picker-date and month is different (differentMonth)
    var differentMonth = false;
    // checks if it's the same date again
    if (currentDate !== previousDate) {
      // if either month or year are different then month has changed
      if (
        dates[0].getMonth() !== dates[1].getMonth() ||
        dates[0].getYear() !== dates[1].getYear()
      ) {
        differentMonth = true;
      }
    }

    return differentMonth;
  }

  function addToCalendar(start, end, counter, cellClass) {
    var currentMonth = cellClass === true ? true : false;

    for (var i = start; i <= end; i++) {
      counter += 1;
      if (i === todayDate && currentMonth) {
        currentRow += `<td class="active">${i}</td>`;
      } else if (cellClass && !currentMonth) {
        currentRow += `<td class="${cellClass}">${i}</td>`;
      } else {
        currentRow += `<td>${i}</td>`;
      }
      if (counter % 7 === 0) {
        datePicker.append(currentRow + closeRow);
        currentRow = openRow;
      }
    }
  }
}

function updatePickerMonth() {
  var monthName = monthFormatter.format(dates[currentDate]);
  var year = dates[currentDate].getFullYear();
  var dateText = monthName + " " + year;
  $("#date-picker-month").text(dateText);
}

function dateSelected(currentDay) {
  // get current date and update
  dates[currentDate].setDate(currentDay);
  updateDateShown();
}

// 'direction' can be either "Next" or "Previous"
function changeMonth(direction) {
  var increment = direction === "Next" ? 1 : -1;

  // change month
  dates[currentDate] = addMonths(dates[currentDate], increment);

  // change month name in picker
  updatePickerMonth();

  // update calendar
  // passes 'true' that month has changed
  updateDatePicker(true);
}

function applyDateEventListener() {
  $("#date-picker td").click(function () {
    // Calendar UI
    $("#date-picker td").removeClass("active");
    $(this).addClass("active");

    // update variables
    currentDay = $(this).text();

    // update the current date
    dateSelected(currentDay);

    // change month based on calendar day class
    if ($(this).hasClass("previous-month")) {
      changeMonth("Previous");
    } else if ($(this).hasClass("next-month")) {
      changeMonth("Next");
    }
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
  var result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getDateString(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return day + "/" + month + "/" + year;
}

function updateDateShown() {
  var formattedDate = getDateString(dates[currentDate]);
  var updateDateBox = $(datesBoxes[currentDate]);

  var updateDisplayBox = $(displayBoxes[currentDate]);
  var dayAndMonth =
    dates[currentDate].getDate() +
    " " +
    monthFormatter.format(dates[currentDate]).slice(0, 3);

  updateDateBox.text(formattedDate);
  updateDisplayBox.text(dayAndMonth);

  console.log(formattedDate, dates[0]);
}
