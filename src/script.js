const monthFormatter = new Intl.DateTimeFormat("en-us", { month: "long" });
const weekdayFormatter = new Intl.DateTimeFormat("en-us", { weekday: "long" });

let dates = [];

dates[0] = new Date();
dates[1] = addDays(dates[0], 31);

let currentDate = 0;
let previousDate = 1;

// set up dates
$(document).ready(() => updateDatePicker());

// add event listeners
$(document).ready(() => {
  // has to be applied each time, as it's removed when calendar is reset
  applyDateEventListener();

  $(".date-picker-date").click((e) => {
    // if active, toggle picker off and return
    let currentlyActive = $(this).hasClass("active");
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

  $("#date-picker-next-month").click(() => {
    changeMonth("Next");
  });

  $("#date-picker-previous-month").click(() => {
    changeMonth("Previous");
  });

  $("#reserve-btn").click(() => {
    const date = getDateString(dates[currentDate]);
    const [day, month, year] = date.split("/");
    const dateObj = new Date(year, month - 1, day);

    const formattedDateStr = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const whatsAppMsg = `Hello Tours en Bici CDMX! I would schedule to reserve a tour for ${formattedDateStr}`;
    const whatsAppNumber = "5215583333677";
    const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURI(
      whatsAppMsg
    )}`;

    window.open(whatsAppLink, "_blank");
  });

  $("#reset-btn").click(() => {
    // Get todays date
    const today = new Date();
    // get current date and update
    dates[currentDate].setDate(today.getDate());
    dates[currentDate].setMonth(today.getMonth());
    dates[currentDate].setFullYear(today.getFullYear());
    updateDatePicker(true);
  });
});

// called on initialising (set to today) and then every time the month changes or on moving between dates
function updateDatePicker(changeMonth = false) {
  const datePicker = $("#date-picker");
  let curDate = dates[currentDate]; // shorthand

  // check if it needs to update
  // updates if changed month directly (changeMonth) or if switched to other .date-picker-date and month is different (differentMonth)
  const differentMonth = checkChangedMonth();
  if (changeMonth === false && differentMonth === false) return;
  updatePickerMonth();

  // clear out all tr instances other than the header row
  // really just removing all rows and appending header row straight back in
  const headerRow = `
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

  let todayDate = curDate.getDate();
  let firstOfMonth = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
  let firstWeekday = firstOfMonth.getDay(); // 0-indexed; 0 is Sunday, 6 is Saturday
  let lastMonthToInclude = firstWeekday; // happily, this just works as-is.
  let firstOfNextMonth = addMonths(firstOfMonth, 1);
  let lastOfMonth = addDays(firstOfNextMonth, -1).getDate();

  let openRow = "<tr class='date-picker-calendar-row'>";
  let closeRow = "</tr>";
  let currentRow = openRow;

  // Add in as many of last month as required
  if (lastMonthToInclude > 0) {
    let lastMonthLastDay = addDays(firstOfMonth, -1);
    let lastMonthDays = lastMonthLastDay.getDate();
    let lastMonthStartAdding = lastMonthDays - lastMonthToInclude + 1;
    addToCalendar(lastMonthStartAdding, lastMonthDays, 0, "previous-month");
  }

  // fill out rest of row with current month
  // doesn't matter how many of last month were included, all accounted for
  addToCalendar(1, 7 - lastMonthToInclude, lastMonthToInclude, true);

  // reset for current month generation
  currentRow = openRow;

  let counter = 7;
  let addedFromCurrentMonth = 7 - firstWeekday + 1;

  addToCalendar(addedFromCurrentMonth, lastOfMonth, counter, true);

  // at this point, counter = all of this month + whatever was included from last month
  counter = lastMonthToInclude + lastOfMonth;
  let nextMonthToInclude = counter % 7 === 0 ? 0 : 7 - (counter % 7);

  addToCalendar(1, nextMonthToInclude, counter, "next-month");

  // add event listener again
  applyDateEventListener();

  function checkChangedMonth() {
    // updates if changed month directly (changeMonth) or if switched to other .date-picker-date and month is different (differentMonth)
    let differentMonth = false;
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
    const currentMonth = cellClass === true ? true : false;

    for (let i = start; i <= end; i++) {
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
  let monthName = monthFormatter.format(dates[currentDate]);
  let year = dates[currentDate].getFullYear();
  let dateText = monthName + " " + year;
  $("#date-picker-month").text(dateText);
}

function dateSelected(currentDay) {
  dates[currentDate].setDate(currentDay);
}

// 'direction' can be either "Next" or "Previous"
function changeMonth(direction) {
  let increment = direction === "Next" ? 1 : -1;

  // change month
  dates[currentDate] = addMonths(dates[currentDate], increment);

  // change month name in picker
  updatePickerMonth();

  // set selected date to the first of the month
  dates[currentDate].setDate(1);
  // update calendar
  updateDatePicker(true);
}

function applyDateEventListener() {
  $("#date-picker td").click(function () {
    // Calendar UI
    $("#date-picker td").removeClass("active");
    $(this).addClass("active");

    // update letiables
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
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getDateString(date) {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return day + "/" + month + "/" + year;
}
