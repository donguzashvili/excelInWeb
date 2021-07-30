const URL = "assets/fackeBackEnd/data.json";
const dataArray = [];
let search = [];
let regex = "";
let columnNum = 0;
let id = 15;
let table = null;
let dataTable;
let nameArray = [];

function fetchData(url) {
  try {
    fetch(url)
      .then((res) => res.json())
      .then((data) => objectCreate(data));
  } catch (err) {
    console.log(err);
  }
}

let tHeadID = 0;

function objectCreate(data) {
  for (let key in data) {
    for (let i = 0; i < data[key].length; i++) {
      dataArray.push({
        id: data.id[i],
        payment_amount: data.payment_amount[i],
        graphic_date: data.graphic_date[i],
        valuta: data.valuta[i],
        valuta_course: data.valuta_course[i],
        payment_date: data.payment_date[i],
        payment_course: data.payment_course[i],
        real_payment: data.real_payment[i],
        customer_id: data.customer_id[i],
        realization_id: data.realization_id[i],
        doc_num: data.doc_num[i],
        purpose: data.purpose[i],
        staff_group_id: data.staff_group_id[i],
      });
    }
    break;
  }

  renderCustomer(dataArray);
  let croped;
  for (let key in data) {
    if (key.includes("_")) {
      let splited = key.replace("_", " ");
      if (splited.includes("_")) {
        splited = splited.replace("_", " ");
      }
      croped = splited.split(" ");
      nameArray.push(croped);
    } else {
      nameArray.push(key);
    }
  }
  let changed;
  for (let i = 0; i < nameArray.length; i++) {
    for (let j = 0; j < nameArray[i].length; j++) {
      if (typeof nameArray[i] === "string") {
        changed = nameArray[i].replace(
          nameArray[i].charAt(0),
          nameArray[i].charAt(0).toUpperCase()
        );
        nameArray[i] = changed;
        if (nameArray[i].length < 3) {
          changed = nameArray[i].toUpperCase();
          nameArray[i] = changed;
        }
      }
      changed = nameArray[i][j].replace(
        nameArray[i][j].charAt(0),
        nameArray[i][j].charAt(0).toUpperCase()
      );
      nameArray[i][j] = changed;
      if (nameArray[i][j].length < 3) {
        changed = nameArray[i][j].toUpperCase();
        nameArray[i][j] = changed;
      }
    }

    let h5 = document.getElementsByClassName("summeryHeader")[i];
    h5.innerHTML =
      typeof nameArray[i] === "string"
        ? nameArray[i] + " Summery"
        : nameArray[i].join(" ") + " Summery";
  }
  calcVisibleData();
}

function renderCustomer(array) {
  dataTable = $("#myTable").DataTable({
    autoWidth: false,
    regex: true,
    data: array,
    columns: [
      {
        data: "id",
        title: "ID",
      },
      {
        data: "payment_amount",
        title: "Payment Amount",
      },
      {
        data: "graphic_date",
        title: "Graphic Date",
      },
      {
        data: "valuta",
        title: "Valuta",
      },
      {
        data: "valuta_course",
        title: "Valuta Course",
      },
      {
        data: "payment_date",
        title: "Payment Date",
      },

      {
        data: "payment_course",
        title: "Payment Course",
      },
      {
        data: "real_payment",
        title: "Real Payment",
      },
      {
        data: "customer_id",
        title: "Customer ID",
      },
      {
        data: "realization_id",
        title: "Realization ID",
      },
      {
        data: "doc_num",
        title: "Doc Num",
      },
      {
        data: "purpose",
        title: "Purpose",
      },
      {
        data: "staff_group_id",
        title: "Staff Group ID",
      },
    ],
  });

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
}

const handleCheckBox = (e) => {
  columnNum = e.target.id;
  regex = "";
  search = [];
  e.target.parentNode.parentNode.children[1].classList.toggle("open");
};

function selectSearch() {
  let columnId = 0;
  const columnsData = table.columns().data();
  const checkboxes = $(".checkboxesContainer");
  let uniqueData;
  for (let i = 0; i < columnsData.length; i++) {
    uniqueData = columnsData[i].filter((v, i, a) => a.indexOf(v) === i);
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

  const checkBox = $("input[type = checkbox]");
  checkBox.each(function () {
    $(this).on("keyup change", function (e) {
      columnId =
        e.target.parentNode.parentNode.parentNode.previousElementSibling
          .children[1].id;
      regex = "";
      if (this.checked) {
        search.push($(this).val());
        for (let i = 0; i < search.length; i++) {
          if (i >= 1) {
            regex += "|" + "^" + search[i];
          } else {
            regex += search[i];
          }
          // i >= 1 ? (regex += "|" + search[i]) : (regex += search[i]);
        }
        $(e.target.form[0][0]).text($(this).val()).val();
        table.column(columnId).each(function () {
          const column = this;
          column.search(regex, true, true).draw();
        });
        calcVisibleData();
      } else if (!this.checked) {
        table.column(columnId).every(function () {
          const column = this;
          column.search("").draw();
        });
        calcVisibleData();
      } else {
        let index = search.indexOf($(this).val());
        $(e.target.form[0][0]).text(" ").val();
        search.length > 0 ? search.splice(index, 1) : null;
        table.column(columnId).every(function () {
          const column = this;
          column.search("").draw();
        });
        calcVisibleData();
      }
    });
  });
  // widthRelative();
}

// function widthRelative() {
//   $(".multiselect").on("click", function (e) {
//     let container = e.target.offsetParent.nextElementSibling;
//     let child = e.target.offsetParent.nextElementSibling.children[1];
//     let tempVar;
//     for (let i = 0; i < child.children.length; i++) {
//       console.log(child.children[1].children[i]);
//     }
//   });
// }
function calcVisibleData() {
  let tableRow = document.getElementsByTagName("tr");
  let container = document.getElementsByClassName("visibleData");

  for (let i = 2; i < tableRow.length; i++) {
    let currentData;
    for (let j = 0; j < container.length; j++) {
      if (tableRow[i].children[j].innerHTML === "No matching records found") {
        container[j].innerHTML = "Current Data: No Data";
        console.log(tableRow[i].children[j].innerHTML);
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
    console.log(container[i].innerHTML);

    if (container[i].innerHTML === "") {
      container[i].innerHTML = `Current Data: No Data`;
    } else if (container[i].innerHTML === "Current Data: No Data") {
      container[i].innerHTML === "Current Data: No Data";
    } else if (container[i].innerHTML === "Current Data: 0") {
      container[i].innerHTML === "Current Data: No Data";
    } else {
      container[i].innerHTML = `Current Data: ${container[i].innerHTML}`;
    }
  }
}
function individualSearch() {
  $(".indSearch").on("input", function (e) {
    columnId = e.target.parentNode.parentNode.children[0].children[1].id;

    let container = e.target.parentNode.children[1];
    let newValue = this.value;

    searchData(columnId, container, newValue);
  });
}

function searchData(id, container, value) {
  let data = table.column(id).data();
  let checkedInputs = "";
  let uniqueData = data.filter((v, i, a) => a.indexOf(v) === i);
  let sortedData = uniqueData.sort((a, b) => {
    return a - b;
  });
  sortedData.map((item) => {
    if (item.startsWith(value)) {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${item} />
                         ${item}
                        </label>`;
    } else if (value === "") {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${item} />
                         ${item}
                        </label>`;
    }
  });
  container.innerHTML = checkedInputs;
}

function styleHtml() {
  //create footer and header
  const header = document.createElement("header");
  const footer = document.createElement("footer");

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
  let data = table.columns().data();
  for (let i = 0; i < 13; i++) {
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
  totalData();

  let td = document.getElementsByTagName("td");
  for (let i = 0; i < td.length; i++) {
    if (td[i].innerHTML.length > 15) {
      let storedData = td[i].innerHTML;
      td[i].textContent.slice(15, td[i].textContent.length);
      td[i].textContent += "...";
    }
  }

  function totalData() {
    let summery = document.getElementsByClassName("summeryData");
    let visibleData = document.getElementsByClassName("visibleData");
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
      summery[i].innerHTML = "Total Data: " + res;
      if (summery[i].innerHTML === "Total Data: 0") {
        summery[i].innerHTML = "Total Data: No Data";
      }
    }
  }

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
