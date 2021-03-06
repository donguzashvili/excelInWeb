const URL = "http://192.168.48.11:8000/api/api.php";
const dataArray = [];
let searchArr = [];
let closeWindow = false;
let regex = "";
let columnNum = 0;
let id = 15;
let table = null;
let nameArray = [];
let searchObj = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
};
let storedData = {};
let fetchFix = {
  tr: 0,
};
let checkboxStatus = {};

let obj = {};
obj.start_date = "";
obj.end_date = "";
let json_data = JSON.stringify(obj);

let formdata = new FormData();
formdata.append("token", "fr-R#WinBRj12Tyy^Sm=#bi30Zs@Ql");
formdata.append("act", "report1");
formdata.append(
  "data",
  `{"start_date": "${localStorage.getItem(
    "startDate"
  )}", "end_date": "${localStorage.getItem("endDate")}"}`
);

let options = {
  method: "POST",
  body: formdata,
  redirect: "follow",
};

function fetchData() {
  try {
    fetch(URL, options)
      .then((res) => res.json())
      .then((data) => renderCustomer(data.data));
  } catch (err) {
    console.log(err);
  }
}

function handleTime() {
  let applyTimeBtn = document.getElementsByClassName("applyBtn")[0];
  applyTimeBtn.addEventListener("click", () => {
    let box = document.getElementsByClassName("drp-selected")[0];
    obj.start_date = box.innerHTML.split(" ")[0];
    localStorage.setItem("startDate", obj.start_date);
    obj.end_date = box.innerHTML.split(" ")[2];
    localStorage.setItem("endDate", obj.end_date);

    location.reload();
  });
  date.value = `${localStorage.getItem("startDate")} - ${localStorage.getItem(
    "endDate"
  )}`;
}
let tHeadID = 0;

//dataTable
function renderCustomer(array) {
  table = $("#myTable").DataTable({
    pageLength: 100,
    regex: true,
    autoWidth: false,
    data: array,
    search: {
      smart: false,
    },

    columns: [
      {
        data: "code",
        title: "Code",
      },
      {
        data: "doc_type",
        title: "Doc Type",
      },
      {
        data: "manager",
        title: "Manager",
      },
      {
        data: "manager2",
        title: "Manager ???2",
      },

      {
        data: "name",
        title: "Name",
      },
      {
        data: "pay_type",
        title: "Pay Type",
      },
      {
        data: "purpose",
        title: "Purpose",
      },
      {
        data: "sector",
        title: "Sector",
      },
      {
        data: "w_cost",
        title: "Cost",
      },
      {
        data: "waybill_num",
        title: "WayBill Num",
      },
    ],
  });

  //html
  $("#myTable thead th").each(function () {
    const title = $("#myTable thead th").eq($(this).index()).text();
    $(this).html(
      '<div class="wrapper">' +
        "<label for= " +
        title +
        " >" +
        title +
        "" +
        "</label>" +
        "<form >" +
        '  <div class="multiselect" >' +
        '    <div class="selectBox" >' +
        "      <select>\n" +
        "        <option> </option>" +
        "      </select>" +
        "      <div id = " +
        tHeadID +
        ' class="overSelect"  onclick="handleCheckBox(event)"></div>' +
        "    </div>" +
        '    <div class="checkboxes">' +
        `<div class="searchBoxes">` +
        `<input type=text class="indSearch" placeholder="search by ${title}" oninput=individualSearch()>` +
        ` <label for=${id++}>` +
        `<input onclick="toggle(event,this)" id=${id++ - 1} ` +
        `type="checkbox" value="selectAll" />
        <p className="checkboxData">Select/Unselect All</p>
        </label>` +
        `</div>` +
        `<div class="selectedContainer"></div>` +
        '<div class="checkboxesContainer"></div>' +
        "    </div>\n" +
        "  </div>\n" +
        "</form>" +
        "</div>"
    );
    tHeadID++;
  });
  styleHtml();
  syleMainSearch();
  paginate();
  cropTD();
}

//toggle checkbox container
const handleCheckBox = (e) => {
  e.stopPropagation();
  let containerPos = e.target.parentNode.nextElementSibling;
  e.target.parentNode.parentNode.children[1].classList.toggle("open");
  makeCheckboxes(e);
  containerPos.scrollTop = 0;
};

// //give main search placeholder
function syleMainSearch() {
  let searchInput =
    document.getElementById("myTable_filter").children[0].children[0];
  searchInput.setAttribute("placeholder", "Search for any data");
}
function cropTD() {
  const td = document.getElementsByTagName("td");
  for (let i = 0; i < td.length; i++) {
    if (td[i].innerHTML && td[i].innerHTML.length > 20) {
      if (td[i].childElementCount === 0) {
        if (i % 2 === 0) {
          td[i].classList.add("hiddenDataTd");
          let hiddenData = td[i].innerHTML;
          let newTd = `${td[i].innerHTML.substring(0, 20)}...`;
          td[i].innerHTML = newTd;
          let span = document.createElement("span");
          span.classList.add("fullData");
          td[i].appendChild(span);
          span.innerHTML = hiddenData;
        }
      }
    }
  }
}

//close select boxes when clicked on window
window.addEventListener("click", () => {
  let open = document.getElementsByClassName("checkboxes");
  for (let i = 0; i < open.length; i++) {
    open[i].addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  for (let i = 0; i < open.length; i++) {
    if (open[i].classList.contains("open") && closeWindow === true) {
      open[i].classList.remove("open");
    }
  }
  closeWindow = true;
});

//make checkboxs for select
function makeCheckboxes(e) {
  const ID = e.target.id;
  const container = e.target.parentNode.nextElementSibling.children[2];

  if (checkboxStatus[ID] === true) {
    container.innerHTML = storedData[ID];
  } else {
    let data = table.columns().data();
    let name = 0;
    let handledData = handleSortAndUnique(data[ID]);
    let checkedInputs = "";
    for (let i = 0; i < handledData.length; i++) {
      if (handledData[i] !== null && handledData[i] !== "") {
        checkedInputs += ` <label for=${id++}>
                      <input onclick="checkboxSearch(event)" type="checkbox" name=${name}  id= ${
          id++ - 1
        } value= ${handledData[i]} />
                   <p className="checkboxData">    ${handledData[i]}</p>
                      </label>`;
      }
    }
    container.innerHTML = checkedInputs;
    storedData[ID] = checkedInputs;
    name++;
    checkboxStatus[ID] = true;
  }
}

function toggle(e, source) {
  let id =
    e.target.parentNode.parentNode.parentNode.previousElementSibling.children[1]
      .id;
  let checkboxes = document.getElementsByName(id);
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = !source.checked;
    checkboxes[i].click();
  }
}

//search for checkbox values
function checkboxSearch(e) {
  columnId =
    e.target.parentNode.parentNode.parentNode.previousElementSibling.children[1]
      .id;
  let container = e.target.parentNode.parentNode.previousElementSibling;
  let child = e.target.parentNode;
  let value = e.target.nextElementSibling.innerHTML.trim();

  if (e.target.checked) {
    container.prepend(child);

    let regex = checkedState(value, columnId);

    table.column(columnId).every(function () {
      const column = this;
      column.search(regex, true, true).draw();
    });

    //if unchecked box
  } else if (!e.target.checked) {
    let value = e.target.nextElementSibling.innerHTML;
    let element = e.target.parentNode;
    let container = e.target.parentNode.parentNode.parentNode.children[2];
    container.prepend(element);

    value = checkString(value);
    id =
      e.target.parentNode.parentNode.parentNode.previousElementSibling
        .children[1].id;
    let regex = uncheckedState(value, id);

    table.column(id).every(function () {
      const column = this;
      column.search(regex === undefined ? " " : regex, true, true).draw();
    });
  }
}

function uncheckedState(value, id) {
  let temp = localStorage.getItem("searchData");
  let json = JSON.parse(temp);
  searchObj = json;
  for (let i = 0; i < json[id].length; i++) {
    if (
      json[id][i].includes(`^${value}`) ||
      json[id][i].includes(`|^${value}`)
    ) {
      json[id].splice(i, 1);
    }
  }

  localStorage.setItem("searchData", JSON.stringify(searchObj));
  regex = " ";

  if (json[id].length > 0) {
    regex = "";
    json[id].map((item) => {
      regex += item;
    });
  }

  return regex;
}

function checkedState(value, id) {
  //handle whitespaces and prepare them for search
  value = checkString(value);
  //if this is not first data in array
  searchObj[id].push(`|^${value}`);
  localStorage.setItem("searchData", JSON.stringify(searchObj));
  if (searchObj[id].length > 0) {
    regex = "";
    searchObj[id].map((item) => {
      regex += item;
    });
  }

  regex = regex.slice(1, regex.length);

  return regex;

  //when search finished and all elements are on table calculate new data
}

// prepare strings for search
function checkString(value) {
  let v_array = value.trim().split(" ").join(".*");

  return v_array;
}

function makeNumbersSeeEasy(value) {
  let reversedStr = value.split("").reverse().join("");
  reversedStr = reversedStr.replace(/(...?)/g, "$1,");
  let originalString = reversedStr.split("").reverse().join("");

  if (originalString.charAt(0) === ",") {
    let correctStr = originalString.substring(1);
    return correctStr;
  } else {
    return originalString;
  }
}

function backToTop() {
  let container = document.getElementById("myTable_wrapper");
  if (container.scrollTop > 20) {
    container.scrollTop = 0;
  }
}

// //search for checkboxes pt1
function individualSearch() {
  $(".indSearch").on("input", function (e) {
    columnId =
      e.target.parentNode.parentNode.previousElementSibling.children[1].id;
    let container = e.target.parentNode.nextElementSibling.nextElementSibling;

    let newValue = this.value;
    searchData(columnId, container, newValue);
  });
}

//search for checkboxes pt2
function searchData(id, container, value) {
  let data = table.columns().data();
  let checkedInputs = "";
  let sortedData = handleSortAndUnique(data[id]);

  for (let i = 0; i < sortedData.length; i++) {
    if (sortedData[i] && sortedData[i].startsWith(value)) {
      checkedInputs += ` <label for=${id++}>
                      <input onclick="checkboxSearch(event)" type="checkbox" name=${name}  id= ${
        id++ - 1
      } value= ${sortedData[i]} />
                   <p className="checkboxData">    ${sortedData[i]}</p>
                      </label>`;
    } else if (sortedData[i] && sortedData[i].includes(value)) {
      checkedInputs += ` <label for=${id++}>
                      <input onclick="checkboxSearch(event)" type="checkbox" name=${name}  id= ${
        id++ - 1
      } value= ${sortedData[i]} />
                   <p className="checkboxData">    ${sortedData[i]}</p>
                      </label>`;
    }
  }
  container.innerHTML = checkedInputs;
}

//styiling html
function styleHtml() {
  //create footer and header
  const header = document.getElementsByClassName("searchHeader")[0];
  const footer = document.getElementsByTagName("footer")[0];
  const dataTableWrapper = document.getElementById("myTable_wrapper");
  const dataTableLength = document.getElementById("myTable_length");
  const dataTableFilter = document.getElementById("myTable_filter");
  const dataTablePaginate = document.getElementById("myTable_paginate");
  const dataTableInfo = document.getElementById("myTable_info");

  //append elements to footer and header
  header.append(dataTableLength);
  dateHtml(header);
  header.append(dataTableFilter);
  footer.classList.add("dataTables_wrapper");
  footer.append(dataTableInfo);
  footer.append(dataTablePaginate);
  dataTableWrapper.prepend(header);
  document.body.append(footer);

  let th = document.getElementsByTagName("th");
  if (th) {
    for (let i = 0; i < th.length; i++) {
      th[i].addEventListener("click", cropTD);
    }
  }

  //total data box
  summeryData();

  //calculate total amount of data
  totalData();

  //toggle checkbox
  createCheckBox();

  //make header fixed on top
  fixedHeader();

  //create calendar
  datePicker();
  // selectSearch();
}
function createCheckBox() {
  const th = document.getElementsByTagName("th");
  for (let i = 0; i < th.length / 2; i++) {
    let button = document.createElement("button");
    button.innerHTML = "click here for checkboxes";
    button.classList.add("checkboxBtn");
    th[i].append(button);
  }
}
function paginate() {
  let paginateButton = document.getElementsByClassName("paginate_button");
  for (let i = 0; i < paginateButton.length; i++) {
    paginateButton[i].setAttribute("onclick", "backToTop()");
    paginateButton[i].addEventListener("click", () => {
      cropTD();
    });
  }
  cropTD();
}

function summeryData() {
  //create summery div
  const tHead = document.getElementsByTagName("thead");
  let tr = document.createElement("tr");
  tr.classList.add("totalBox");
  tHead[0].append(tr);

  //summery row
  for (let i = 0; i < 10; i++) {
    let th = document.createElement("th");
    th.classList.add("grandTotal");
    tr.appendChild(th);
    let div = document.createElement("div");
    div.classList.add("summerybox");
    th.appendChild(div);
    let h5 = document.createElement("h5");
    div.appendChild(h5);
    h5.classList.add("summeryHeader");
    let summeryData = document.createElement("p");
    let visibleData = document.createElement("p");
    div.appendChild(summeryData);
    div.appendChild(visibleData);
    summeryData.classList.add("summeryData");
    visibleData.classList.add("visibleData");
  }
}

function dateHtml(header) {
  let dateContainer = document.createElement("div");
  dateContainer.classList.add("dateContainer");
  header.append(dateContainer);
  let dateLabel = document.createElement("label");
  let dateInput = document.createElement("input");
  let paragraph = document.createElement("p");

  dateInput.setAttribute("id", "date");

  dateContainer.append(dateLabel);
  dateLabel.append(dateInput);
  dateLabel.prepend(paragraph);
  paragraph.innerHTML = "Search by Date";
}

function datePicker() {
  $("#date").daterangepicker({
    [obj.start_date]: moment().startOf("hour"),
    [obj.end_date]: moment().startOf("hour").add(32, "hour"),
    locale: {
      format: "Y-M-DD",
    },
  });
  handleTime();
}

// calculate total amount of data
function totalData() {
  let data = table.columns().data();
  let summery = document.getElementsByClassName("summeryData");

  for (let i = 0; i < data.length; i++) {
    let res = 0;
    let columnData = table.column(i).data();
    for (let j = 0; j < columnData.length; j++) {
      if (
        typeof columnData[j] === "string" &&
        !columnData[j].includes("-") &&
        !columnData[j].includes(".")
      ) {
        if (!isNaN(parseInt(columnData[j], 10))) {
          res += parseInt(columnData[j], 10);
        }
      }
    }
    if (i === 8) {
      let toString = res.toString();
      summery[i].innerHTML = `Total Data: ${makeNumbersSeeEasy(toString)}`;
    } else {
      summery[i].innerHTML = "Total Data: No Data";
    }
  }
}

//make header fixed on top
function fixedHeader() {
  //take tables offset and tableHead
  let table = document.getElementById("myTable");
  let tHead = document.getElementsByTagName("thead");
  let tableWrapper = document.getElementById("myTable_wrapper");
  let td = document.getElementsByClassName("hiddenDataTd");
  //on scroll move header with content like a position fixed
  $(tableWrapper).bind("scroll", function () {
    let offset = $(this).scrollTop();
    if (offset >= table.offsetTop - 30) {
      tHead[0].style.cssText = "transform: translateY(" + offset + "px)";
    } else if (offset < table.offsetTop) {
      tHead[0].style.cssText = "transform: translateY(0)";
    }
    for (let i = 0; i < td.length; i++) {
      if (offset >= td[i].offsetTop - 110) {
        let fullData = td[i];
        console.log(offset);
        console.log(td[i].offsetTop);

        fullData.style.cssText = "visibility: hidden";
      } else {
        let fullData = td[i];
        fullData.style.cssText = "visibility: visible";
      }
    }
    paginate();
  });
}

function handleSortAndUnique(arr) {
  let unique = [...new Set(arr)];
  unique = sortArray(unique);

  return unique;
}
function sortArray(arr) {
  arr.sort((a, b) => a - b);
  return arr;
}

document.addEventListener("DOMContentLoaded", () => fetchData(URL));
