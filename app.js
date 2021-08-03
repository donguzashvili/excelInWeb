const URL = "http://192.168.48.11:8000/api/api.php";
const dataArray = [];
let searchArr = [];
let regex = "";
let columnNum = 0;
let id = 15;
let table = null;
let dataTable;
let nameArray = [];
let searchObj = {};

let obj = {};
obj.start_date = "";
obj.end_date = "";
let json_data = JSON.stringify(obj);

let formdata = new FormData();
formdata.append("token", "fr-R#WinBRj12Tyy^Sm=#bi30Zs@Ql");
formdata.append("act", "report1");
formdata.append(
  "data",
  '{"start_date": "2021-01-02", "end_date":"2021-08-03"}'
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
      .then((data) => objectCreate(data.data));
  } catch (err) {
    console.log(err);
  }
}

let tHeadID = 0;
//open json and make objects for data
function objectCreate(data) {
  for (let i = 0; i < data.length; i++) {
    dataArray.push({
      n: data[i].n,
      code: data[i].code,
      date: data[i].date,
      doc_type: data[i].doc_type,
      manager: data[i].manager,
      manager2: data[i].manager2,
      name: data[i].name,
      pay_type: data[i].pay_type,
      sector: data[i].sector,
      w_cost: data[i].w_cost,
      waybill_num: data[i].waybill_num,
      purpose: data[i].purpose,
    });
    // break;
  }
  //pass this data to dataTable
  renderCustomer(dataArray);
  // handle object keys to use them in header
  let croped;
  // for (let key in data) {
  //   if (key.includes("_")) {
  //     let splited = key.replace("_", " ");
  //     if (splited.includes("_")) {
  //       splited = splited.replace("_", " ");
  //     }
  //     croped = splited.split(" ");
  //     nameArray.push(croped);
  //   } else {
  //     nameArray.push(key);
  //   }
  // }

  // change first char from string and style them(uppercase)
  let changed;
  // for (let i = 0; i < nameArray.length; i++) {
  //   for (let j = 0; j < nameArray[i].length; j++) {
  //     if (typeof nameArray[i] === "string") {
  //       changed = nameArray[i].replace(
  //         nameArray[i].charAt(0),
  //         nameArray[i].charAt(0).toUpperCase()
  //       );
  //       nameArray[i] = changed;
  //       if (nameArray[i].length < 3) {
  //         changed = nameArray[i].toUpperCase();
  //         nameArray[i] = changed;
  //       }
  //     }
  //     changed = nameArray[i][j].replace(
  //       nameArray[i][j].charAt(0),
  //       nameArray[i][j].charAt(0).toUpperCase()
  //     );
  //     nameArray[i][j] = changed;
  //     if (nameArray[i][j].length < 3) {
  //       changed = nameArray[i][j].toUpperCase();
  //       nameArray[i][j] = changed;
  //     }
  //   }
  //   let h5 = document.getElementsByClassName("summeryHeader")[i];
  //   h5.innerHTML =
  //     typeof nameArray[i] === "string"
  //       ? nameArray[i] + " Summery"
  //       : nameArray[i].join(" ") + " Summery";
  // }
  calcVisibleData();
}

//dataTable
function renderCustomer(array) {
  dataTable = $("#myTable").DataTable({
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
  table = dataTable;
  selectSearch(table);
  styleHtml();
  contentLength();
  syleMainSearch();
}

// //toggle checkbox container
const handleCheckBox = (e) => {
  e.stopPropagation();
  columnNum = e.target.id;
  regex = "";
  search = [];
  e.target.parentNode.parentNode.children[1].classList.toggle("open");
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

// //make checkboxs for select
function selectSearch() {
  let columnId = 0;
  const columnsData = table.columns().data();
  const checkboxes = $(".checkboxesContainer");
  let uniqueData;
  for (let i = 0; i < columnsData.length; i++) {
    //make them unique
    uniqueData = columnsData[i].filter((v, i, a) => a.indexOf(v) === i);
    //sort them
    sortedData = uniqueData.sort((a, b) => {
      return a - b;
    });
    let checkedInputs = "";
    for (let j = 0; j < uniqueData.length; j++) {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${
        sortedData[j]
      } />
                     <p className="checkboxData">    ${sortedData[j]}</p>
                        </label>`;
    }
    checkboxes[i].innerHTML = checkedInputs;
  }

  //when checkbox clicked search for value data on each column
  checkboxSearch();

  //make checkbox containers relative to children to handle overflow
  widthRelative();
}

// //search for checkbox values
function checkboxSearch() {
  const checkBox = $("input[type = checkbox]");
  checkBox.each(function () {
    $(this).on("keyup change", function (e) {
      columnId =
        e.target.parentNode.parentNode.parentNode.previousElementSibling
          .children[1].id;

      if (this.checked) {
        //checkbox value
        let container = e.target.parentNode.parentNode;
        let child = e.target.parentNode;
        container.prepend(child);
        let value = this.nextElementSibling.innerHTML.trim();
        //handle whitespaces and prepare them for search
        value = checkString(value);

        //if this is not first data in array
        if (searchArr.length >= 1) {
          searchArr.push(`|^${value}`);
        } else {
          searchArr.push(`^${value}`);
        }

        // createSearchObjects(value, columnId);

        let regex = "";
        //open array and push items in string
        for (let i = 0; i < searchArr.length; i++) {
          // for (let key in searchArr[i]) {
          // columnId = key;
          regex += searchArr[i];
          // }
        }
        $(e.target.form[0][0]).text($(this).val()).val();
        table.column(columnId).every(function () {
          console.log("kolonis nomeri: " + columnId);
          console.log("regexi dzebnis dros: " + regex);
          const column = this;
          column.search(regex, true, true).draw();
        });
        //when search finished and all elements are on table calculate new data
        calcVisibleData();
        //if unchecked box
      } else if (!this.checked) {
        let value = this.nextElementSibling.innerHTML;
        value = checkString(value);

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

          console.log("masivi unchecked is dros: " + searchArr);
          regex = "";
          for (let i = 0; i < searchArr.length; i++) {
            regex += searchArr[i];
          }
          table.column(columnId).every(function () {
            console.log("regexi uncheked is dzebnis dros: " + regex);
            console.log("column ID: " + columnId);
            const column = this;
            column.search(regex + "$", true, true).draw();
          });
          calcVisibleData();
        } else if (searchArr.length === 0) {
          table.column(columnId).every(function () {
            const column = this;
            column.search("", true).draw();
          });
        }
      }
      let $checkbox = $('input[type="checkbox"]');
      if (!$checkbox.is(":checked")) {
        table.columns().every(function () {
          const column = this;
          column.search("", true).draw();
        });
        calcVisibleData();
      }

      console.log(searchArr);
    });
  });
}

function createSearchObjects(value, columnId) {
  let created;
  if (searchArr.length > 0) {
    for (let i = 0; i < searchArr.length; i++) {
      for (let key in searchArr[i]) {
        if (key === columnId && created !== true) {
          created = false;
          searchArr[i][key] += `|^${value}`;
          break;
        } else if (key !== columnId) {
          created = true;
          searchArr.push({ [columnId]: `^${value}` });
        }
        break;
      }
    }
  } else {
    searchArr.push({ [columnId]: `^${value}` });
  }
}
// prepare strings for search
function checkString(value) {
  let v_array = value.trim().split(" ").join(".*");

  return v_array;
}
//make parents container childrens relative
function widthRelative() {
  let selectBox = document.getElementsByTagName("select");
  selectBox[12].style.width = "480px";
}

// //calculate Current Data
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
    } else if (container[i].innerHTML === "Current Data: No Data") {
      container[i].innerHTML === "Current Data: No Data";
    } else if (container[i].innerHTML === "Current Data: 0") {
      container[i].innerHTML === "Current Data: No Data";
    } else {
      //dasamtavrebelia
      let reversedStr = container[i].innerHTML.split("").reverse().join("");
      let string = reversedStr.replace(/(...?)/g, "$1 ").slice(0, -1);
      let originalString = reversedStr.split("").reverse().join("");
      if (originalString.slice(-1) === ",") {
        let correctStr = string.slice(0, -1);
        container[i].innerHTML = `Current Data: ${correctStr}`;
      } else {
        container[i].innerHTML = `Current Data: ${originalString}`;
      }
    }
  }
  // cropString();

  let paginateButton = document.getElementsByClassName("paginate_button");
  for (let i = 0; i < paginateButton.length; i++) {
    paginateButton[i].addEventListener("click", calcVisibleData);
  }
}
//crop long strings and add them in span when hovered
function cropString() {
  let td = document.getElementsByTagName("td");
  for (let i = 0; i < td.length; i++) {
    if (td[i].innerHTML.length > 20) {
      let storedData = td[i].innerHTML;
      let sliced = td[i].textContent.slice(20, td[i].textContent.length);
      let res;
      if (sliced.slice(-1) === " ") {
        let space = sliced.slice(-1);
        res = td[i].textContent.replace(space, "...");
      } else {
        res = td[i].textContent.replace(sliced, "...");
      }
      td[i].innerHTML = res;

      let span = document.createElement("span");
      td[i].appendChild(span);
      td[i].classList.add("hiddenDataTd");
      span.classList.add("fullData");
      span.innerHTML = storedData;
    }
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
  let data = table.column(id).data();
  let checkedInputs = "";
  let uniqueData = data.filter((v, i, a) => a.indexOf(v) === i);
  let sortedData = uniqueData.sort((a, b) => {
    return a - b;
  });
  sortedData.map((item) => {
    if (item.startsWith(value.toUpperCase()) || item.startsWith(value)) {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${item} />
                        <p className="checkboxData">
                        ${item}</p>

                        </label>`;
    } else if (value === "") {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${item} />
                        <p className="checkboxData">
                        ${item}</p>
                        </label>`;
    }
  });
  container.innerHTML = checkedInputs;
}
//styiling html
function styleHtml() {
  //create footer and header
  const header = document.createElement("header");
  const footer = document.createElement("footer");
  header.classList.add("searchHeader");
  const dataTableWrapper = document.getElementById("myTable_wrapper");
  const dataTableLength = document.getElementById("myTable_length");
  const dataTableFilter = document.getElementById("myTable_filter");
  const dataTablePaginate = document.getElementById("myTable_paginate");
  const dataTableInfo = document.getElementById("myTable_info");

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
  let current = document.getElementsByClassName("paginate_button");
  for (let i = 0; i < current.length; i++) {
    current[i].addEventListener("click", calcVisibleData);
  }

  //calculate total amount of data
  totalData();

  //append elements to footer and header
  header.append(dataTableLength);
  header.append(dataTableFilter);
  footer.classList.add("dataTables_wrapper");
  footer.append(dataTableInfo);
  footer.append(dataTablePaginate);
  dataTableWrapper.prepend(header);
  document.body.append(footer);
  fixedHeader();
}

//calculate total amount of data
function totalData() {
  let data = table.columns().data();
  let summery = document.getElementsByClassName("summeryData");
  console.log(console.log(table.column(0).data()));

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

    // let string = res.replace(/(...?)/g, "$1,").slice(0, -1);
    // if (string.slice(-1) === ",") {
    //   let correctStr = string.slice(0, -1);
    //   summery[i].innerHTML = `Total Data: ${correctStr}`;
    // } else {
    //   summery[i].innerHTML = `Total Data: ${string}`;
    // }

    summery[i].innerHTML = "Total Data: " + res;
    if (summery[i].innerHTML === "Total Data: 0") {
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

  //on scroll move header with content like a position fixed
  $(tableWrapper).bind("scroll", function () {
    let offset = $(this).scrollTop();
    if (offset >= table.offsetTop) {
      let position = offset - 12;
      tHead[0].style.cssText = "transform: translateY(" + position + "px)";
    } else if (offset < table.offsetTop) {
      tHead[0].style.cssText = "transform: translateY(-12px)";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => fetchData(URL));
