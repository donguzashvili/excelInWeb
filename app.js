const URL = "http://192.168.48.11:8000/api/api.php";
const dataArray = [];
let searchArr = [];
let regex = "";
let columnNum = 0;
let id = 15;
let table = null;
let nameArray = [];
let searchObj = {};
let storedData = {};
let fetchFix = {
  tr: 0,
};

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
  console.log(applyTimeBtn);
  applyTimeBtn.addEventListener("click", () => {
    let box = document.getElementsByClassName("drp-selected")[0];
    obj.start_date = box.innerHTML.split(" ")[0];
    localStorage.setItem("startDate", obj.start_date);
    obj.end_date = box.innerHTML.split(" ")[2];
    localStorage.setItem("endDate", obj.end_date);

    location.reload();
  });
}
let tHeadID = 0;

//dataTable
function renderCustomer(array) {
  table = $("#myTable").DataTable({
    pageLength: 100,
    autoWidth: false,
    regex: true,
    data: array,
    search: {
      smart: false,
    },
    columns: [
      {
        data: "n",
        title: "№",
      },
      {
        data: "code",
        title: "Code",
      },
      {
        data: "date",
        title: "Date",
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
        title: "Manager №2",
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
      {
        data: "purpose",
        title: "Purpose",
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
        "<form>" +
        '  <div class="multiselect">' +
        '    <div class="selectBox" >' +
        "      <select>\n" +
        "        <option> </option>" +
        "      </select>" +
        "      <div id = " +
        tHeadID +
        ' class="overSelect"  onclick="handleCheckBox(event)"></div>' +
        "    </div>" +
        '    <div class="checkboxes">' +
        `<input type=text class="indSearch" placeholder="search by ${title}" oninput=individualSearch()>` +
        '<div class="checkboxesContainer"></div>' +
        "    </div>\n" +
        "  </div>\n" +
        "</form>" +
        "</div>"
    );
    tHeadID++;
  });
  makeCheckboxes();
  styleHtml();
  contentLength();
  syleMainSearch();
  calcVisibleData();
}

//toggle checkbox container
const handleCheckBox = (e) => {
  e.stopPropagation();
  let containerPos = e.target.parentNode.nextElementSibling;
  e.target.parentNode.parentNode.children[1].classList.toggle("open");
  containerPos.scrollTop = 0;
};

// //give main search placeholder
function syleMainSearch() {
  let searchInput =
    document.getElementById("myTable_filter").children[0].children[0];
  searchInput.setAttribute("placeholder", "Search for any data");
}

//close select boxes when clicked on window
window.addEventListener("click", () => {
  let open = document.getElementsByClassName("checkboxes");

  for (let i = 0; i < open.length; i++) {
    open[i].addEventListener("click", function (e) {
      e.stopPropagation();
    });
    if (open[i].classList.contains("open")) {
      open[i].classList.remove("open");
    }
  }
});

// //when select or input changes calculate new Current Data
function contentLength() {
  let select = document.getElementsByTagName("select")[0];
  let input =
    document.getElementsByClassName("dataTables_filter")[0].children[0]
      .children[0];
  select.addEventListener("change", calcVisibleData);

  input.addEventListener("input", calcVisibleData);
}

//make checkboxs for select
function makeCheckboxes() {
  const select = $(".overSelect");
  // let checkboxContainer = select.parentNode.nextElementSibling.children[1];
  let data = table.columns().data();
  select.each(function () {
    let container = this.parentNode.nextElementSibling.children[1];
    let ID = this.id;
    let handledData = handleSortAndUnique(data[ID]);
    let checkedInputs = "";
    for (let i = 0; i < handledData.length; i++) {
      if (handledData[i] !== null && handledData[i] !== "") {
        checkedInputs += ` <label for=${id++}>
                      <input onclick="checkboxSearch(event)" type="checkbox" id= ${
                        id++ - 1
                      } value= ${handledData[i]} />
                   <p className="checkboxData">    ${handledData[i]}</p>
                      </label>`;
      }
    }
    // let containerPos = e.target.parentNode.nextElementSibling;
    // let containerPos = this.parentNode.nextElementSibling;
    // console.log(containerPos);
    // containerPos.scrollTop = 0;

    container.innerHTML = checkedInputs;
  });
}

//search for checkbox values
function checkboxSearch(e) {
  columnId =
    e.target.parentNode.parentNode.parentNode.previousElementSibling.children[1]
      .id;
  let container = e.target.parentNode.parentNode;
  let child = e.target.parentNode;
  let value = e.target.nextElementSibling.innerHTML.trim();
  let selectValue =
    container.parentNode.previousElementSibling.children[0].children[0];
  if (e.target.checked) {
    container.prepend(child);

    if (selectValue.innerHTML === " ") {
      selectValue.innerHTML = value;
    } else {
      selectValue.innerHTML += ", " + value;
    }

    let regex = checkedState(value);

    table.column(columnId).every(function () {
      console.log("kolonis nomeri: " + columnId);
      console.log("regexi dzebnis dros: " + regex);
      const column = this;
      column.search(regex, true, true).draw();
    });
    calcVisibleData();

    //if unchecked box
  } else if (!e.target.checked) {
    let value = e.target.nextElementSibling.innerHTML;
    let val = value.trim();
    let index = selectValue.innerHTML.search(`${val},`);
    handleSelectInnerHtml(index, value, selectValue);

    value = checkString(value);

    let regex = uncheckedState(value);

    table.column(0).every(function () {
      console.log(columnId);
      console.log("regexi: " + regex);
      const column = this;
      column.search(regex === undefined ? " " : regex, true, true).draw();
    });
    calcVisibleData();
  }
}
function handleSelectInnerHtml(index, value, selectValue) {
  if (index != -1) {
    let firstSlice = selectValue.innerHTML.slice(0, index);
    let secondSlice = selectValue.innerHTML.slice(
      index + value.length,
      selectValue.length
    );
    selectValue.innerHTML = firstSlice + secondSlice;
  } else {
    index = selectValue.innerHTML.search(value.trim());
    if (index + value.length === selectValue.innerHTML.length) {
      let firstSlice = selectValue.innerHTML.slice(0, index - 2);
      let secondSlice = selectValue.innerHTML.slice(
        index + value.length,
        selectValue.length
      );
      selectValue.innerHTML = firstSlice + secondSlice;
    }
    let firstSlice = selectValue.innerHTML.slice(0, index);
    let secondSlice = selectValue.innerHTML.slice(
      index + value.length,
      selectValue.length
    );
    selectValue.innerHTML = firstSlice + secondSlice;
  }
}
function uncheckedState(value) {
  searchArr = [];
  searchArr = localStorage.getItem("searchData").split(",");

  for (let i = 0; i < searchArr.length; i++) {
    if (
      searchArr[i].includes(`^${value}`) ||
      searchArr[i].includes(`|^${value}`)
    ) {
      searchArr.splice(i, 1);
    }
  }
  if (searchArr.length >= 1) {
    if (searchArr[0].startsWith("|")) {
      let firstChar = searchArr[0].slice(1);
      searchArr[0] = firstChar;
    }
  }
  localStorage.setItem("searchData", searchArr);
  regex = " ";

  regex = localStorage.getItem("searchData").split(",").join("");

  return regex;
}

function checkedState(value) {
  //handle whitespaces and prepare them for search
  value = checkString(value);

  //if this is not first data in array
  if (searchArr.length >= 1) {
    searchArr.push(`|^${value}`);
    localStorage.setItem("searchData", searchArr);
  } else {
    searchArr.push(`^${value}`);
    localStorage.setItem("searchData", searchArr);
  }

  let regex = "";

  regex = localStorage.getItem("searchData").split(",").join("");

  return regex;

  //when search finished and all elements are on table calculate new data
}

// prepare strings for search
function checkString(value) {
  let v_array = value.trim().split(" ").join(".*");

  return v_array;
}

//make parents container childrens relative
function widthRelative(e) {
  // let length = Math.max.apply(
  //   Math,
  //   this.sortedData.map((el) => (el ? el.length : 0))
  // );
  // e.target.parentNode.style.width = length * 11.5 + "px";
}

// calculate Current Data
function calcVisibleData() {
  let tableRow = document.getElementsByTagName("tr");
  let container = document.getElementsByClassName("visibleData");

  for (let i = 2; i < tableRow.length; i++) {
    let currentData;
    for (let j = 0; j < container.length; j++) {
      if (tableRow[2].children[0].innerHTML === "No matching records found") {
        container[j].innerHTML = "Current Data: No Data";
      } else if (typeof tableRow[i].children[j].innerHTML === "string") {
        let checked;
        if (tableRow[i].children[j].innerHTML.includes("-")) {
          checked = null;
        } else {
          checked = parseInt(tableRow[i].children[j].innerHTML);
        }
        if (!isNaN(checked)) {
          if (
            typeof container[j].innerHTML === "undefined" ||
            isNaN(parseInt(container[j].innerHTML))
          ) {
            container[j].innerHTML = "0";
            currentData = parseInt(container[j].innerHTML);
            currentData += checked;
            container[j].innerHTML = currentData;
          } else {
            currentData = parseInt(container[j].innerHTML);
            currentData += checked;
            container[j].innerHTML = currentData;
          }
        }
      }
    }
  }
  for (let i = 0; i < container.length; i++) {
    if (container[i].innerHTML === "") {
      container[i].innerHTML = `Current Data: No Data`;
    } else if (container[i].innerHTML) {
      container[i].innerHTML = `Current Data: ${makeNumbersSeeEasy(
        container[i].innerHTML
      )}`;
    }
  }

  let paginateButton = document.getElementsByClassName("paginate_button");
  for (let i = 0; i < paginateButton.length; i++) {
    paginateButton[i].setAttribute("onclick", "backToTop()");
    paginateButton[i].addEventListener("click", () => {
      calcVisibleData();
    });
  }
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
    columnId = e.target.parentNode.parentNode.children[0].children[1].id;
    let container = e.target.parentNode.children[1];

    let newValue = this.value;
    searchData(columnId, container, newValue);
  });
}

//search for checkboxes pt2
function searchData(id, container, value) {
  let data = table.columns().data();
  let checkedInputs = "";
  let sortedData = handleSortAndUnique(data[id]);
  let element = container.children;
  let input = container.parentNode.children[0];
  for (let i = 0; i < container.children.length; i++) {
    if (element[i].children[0].value.startsWith(value)) {
      container.innerHTML = element[i].outerHTML;
    }
  }
  if (input.value.length < 1) {
    container.innerHTML = storedData[id];
  }
  // for (let i = 0; i < sortedData.length; i++) {
  //   if (typeof sortedData[i] !== "object") {
  //     if (
  //       (sortedData[i] !== null &&
  //         sortedData[i].toString().startsWith(value.toUpperCase())) ||
  //       sortedData[i].toString().startsWith(value)
  //     ) {
  //       checkedInputs += ` <label for=${id++}>
  //                       <input type="checkbox" id= ${id++ - 1} value= ${
  //         sortedData[i]
  //       } />
  //                       <p className="checkboxData">
  //                       ${sortedData[i]}</p>
  //                       </label>`;
  //     } else if (value === "") {
  //       checkedInputs += ` <label for=${id++}>
  //                       <input type="checkbox" id= ${id++ - 1} value= ${
  //         sortedData[i]
  //       } />
  //                       <p className="checkboxData">
  //                       ${sortedData[i]}</p>
  //                       </label>`;
  //     }
  //   }
  // }
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
  summeryData();

  //calculate total amount of data
  totalData();

  //append elements to footer and header
  header.append(dataTableLength);
  dateHtml(header);
  header.append(dataTableFilter);
  footer.classList.add("dataTables_wrapper");
  footer.append(dataTableInfo);
  footer.append(dataTablePaginate);
  dataTableWrapper.prepend(header);
  document.body.append(footer);
  fixedHeader();
  datePicker();
  // selectSearch();
}

function summeryData() {
  //create summery div
  const tHead = document.getElementsByTagName("thead");
  let tr = document.createElement("tr");
  tr.classList.add("totalBox");
  tHead[0].append(tr);
  // const thLength = document.getElementsByTagName("th");

  //summery row
  for (let i = 0; i < 12; i++) {
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
    if (res !== 0) {
      let toString = res.toString();
      summery[i].innerHTML = `Total Data: ${makeNumbersSeeEasy(toString)}`;
    } else {
      summery[i].innerHTML = "Total Data: No Data";
    }
  }
}

function styleDate() {
  let header = document.getElementsByClassName("searchHeader");
  console.log(header);
}

//make header fixed on top
function fixedHeader() {
  //take tables offset and tableHead
  let table = document.getElementById("myTable");
  let tHead = document.getElementsByTagName("thead");
  let tableWrapper = document.getElementById("myTable_wrapper");

  //on scroll move header with content like a position fixed
  $(tableWrapper).bind("scroll", function () {
    let offset = $(this).scrollTop();
    if (offset >= table.offsetTop) {
      let position = offset;
      tHead[0].style.cssText = "transform: translateY(" + position + "px)";
    } else if (offset < table.offsetTop) {
      tHead[0].style.cssText = "transform: translateY(0)";
    }
  });
}

function handleSortAndUnique(arr) {
  let unique = [...new Set(arr)];
  unique = sortArray(unique);

  return unique;
}
function sortArray(arr) {
  // Finding the length of array 'arr'
  let length = arr.length;

  // Sorting using a single loop
  for (let j = 0; j < length - 1; j++) {
    // Checking the condition for two
    // simultaneous elements of the array
    if (arr[j] > arr[j + 1]) {
      // Swapping the elements.
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;

      // updating the value of j = -1
      // so after getting updated for j++
      // in the loop it becomes 0 and
      // the loop begins from the start.
      j = -1;
    }
  }

  return arr;
}

document.addEventListener("DOMContentLoaded", () => fetchData(URL));
