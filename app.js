const URL = "assets/fackeBackEnd/data.json";
const dataArray = [];
let search = [];
let regex = "";
let columnNum = 0;
let id = 15;

function fetchData(url) {
  try {
    fetch(url)
      .then((res) => res.json())
      .then((data) => objectCreate(data));
  } catch (err) {
    console.log(err);
  }
}

function styleHtml() {
  const header = document.createElement("header");
  const footer = document.createElement("footer");

  const dataTableWrapper = document.getElementById("myTable_wrapper");
  const dataTableLength = document.getElementById("myTable_length");

  const dataTableFilter = document.getElementById("myTable_filter");
  const dataTablePaginate = document.getElementById("myTable_paginate");
  const dataTableInfo = document.getElementById("myTable_info");

  header.append(dataTableLength);
  header.append(dataTableFilter);

  footer.classList.add("dataTables_wrapper");
  footer.append(dataTableInfo);
  footer.append(dataTablePaginate);

  dataTableWrapper.prepend(header);
  document.body.append(footer);
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
}

function renderCustomer(array) {
  const table = $("#myTable").DataTable({
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
        '<input id="' +
        title +
        '" type="text" placeholder="Search ' +
        title +
        '"/>' +
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
        "    </div>\n" +
        "  </div>\n" +
        "</form>" +
        "</div>"
    );
    tHeadID++;

    table.columns().every(function () {
      const column = this;
      $("input", this.header()).on("keyup change", function () {
        column.search(this.value).draw();
      });
    });
  });
  selectSearch(table);
  styleHtml();
}

const handleCheckBox = (e) => {
  columnNum = e.target.id;
  regex = "";
  search = [];
  e.target.parentNode.parentNode.children[1].classList.toggle("open");
};

function selectSearch(table) {
  let columnId = 0;
  const columnsData = table.columns().data();
  const checkboxes = $(".checkboxes");
  for (let i = 0; i < columnsData.length; i++) {
    let checkedInputs = ``;
    for (let j = 0; j < columnsData[i].length; j++) {
      checkedInputs += ` <label for=${id++}>
                        <input type="checkbox" id= ${id++ - 1} value= ${
        columnsData[i][j]
      } />
                         ${columnsData[i][j]}
                        </label>`;
    }
    checkboxes[i].innerHTML = checkedInputs;
  }

  const checkBox = $("input[type = checkbox]");
  checkBox.each(function () {
    $(this).on("keyup change", function (e) {
      columnId =
        e.target.parentNode.parentNode.previousElementSibling.children[1].id;
      regex = "";
      if (this.checked) {
        search.push($(this).val());
        for (let i = 0; i < search.length; i++) {
          i >= 1 ? (regex += "|" + search[i]) : (regex += search[i]);
        }
        $(e.target.form[0][0]).text($(this).val()).val();
        table.column(columnId).every(function () {
          const column = this;
          column.search(regex, true, false).draw();
        });
      } else {
        let index = search.indexOf($(this).val());
        $(e.target.form[0][0]).text(" ").val();
        search.length > 0 ? search.splice(index, 1) : null;
        table.column(columnId).every(function () {
          const column = this;
          column.search("").draw();
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => fetchData(URL));
