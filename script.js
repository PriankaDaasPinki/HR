document.addEventListener("DOMContentLoaded", () => {
  // Selectors for table data and inputs
  const selectors = {
    weightCompetencies: ".weightCompetencies",
    selfRatingCompetencies: ".selfRating input",
    reportingCompetencies: ".reportingCompetencies input",
    scoreCompetencies: ".scoreCompetencies",
    subtotalWeightCompetencies: "#subtotalWeightCompetencies",
    subtotalSelfRating: "#subtotalSelfRating",
    subtotalReporting: "#subtotalReporting",
    subtotalScoreCompetencies: "#subtotalScoreCompetencies",
    weightKPI: ".weightKPI",
    selfRatingKPI: ".selfRatingKPI input",
    reportingKPI: ".reportingKPI input",
    scoreKPI: ".scoreKPI",
    subtotalWeightKPI: "#subtotalWeightKPI",
    subtotalSelfRatingKPI: "#subtotalSelfRatingKPI",
    subtotalReportingKPI: "#subtotalReportingKPI",
    subtotalScoreKPI: "#subtotalScoreKPI",
    scoreAccumulation: "#scoreAccumulation",
    WarningForMisconduct: "#WarningForMisconduct",
    WarningForAttendance: "#WarningForAttendance",
    AdditionalScore: "#AdditionalScore",
    AggregatedScore: "#AggregatedScore",
  };

  // Helper to get all relevant elements
  const elements = Object.fromEntries(
    Object.entries(selectors).map(([key, selector]) => [
      key,
      document.querySelectorAll(selector).length > 1
        ? document.querySelectorAll(selector)
        : document.querySelector(selector),
    ])
  );

  // Helper function to calculate subtotals
  const calculateSubtotal = (cells, subtotalCell) => {
    const subtotal = Array.from(cells).reduce((acc, cell) => {
      const value = parseFloat(cell.value || cell.textContent) || 0;
      return acc + value;
    }, 0);
    if (subtotalCell) subtotalCell.textContent = subtotal.toFixed(2);
  };

  // Function to calculate individual scores
  const calculateScore = (weightCell, reportingInput, scoreCell) => {
    const weight = parseFloat(weightCell.textContent) || 0;
    const reporting = parseFloat(reportingInput.value) || 0;
    const score = (weight * reporting) / 100;
    if (scoreCell) scoreCell.textContent = score.toFixed(2);
  };

  // Update all scores and subtotals
  const updateScoresAndSubtotals = () => {
    // Calculate competencies
    elements.weightCompetencies.forEach((weightCell, index) => {
      calculateScore(
        weightCell,
        elements.reportingCompetencies[index],
        elements.scoreCompetencies[index]
      );
    });

    // Calculate KPIs
    elements.weightKPI.forEach((weightCell, index) => {
      calculateScore(
        weightCell,
        elements.reportingKPI[index],
        elements.scoreKPI[index]
      );
    });

    // Update subtotals
    calculateSubtotal(
      elements.weightCompetencies,
      elements.subtotalWeightCompetencies
    );
    calculateSubtotal(
      elements.selfRatingCompetencies,
      elements.subtotalSelfRating
    );
    calculateSubtotal(
      elements.reportingCompetencies,
      elements.subtotalReporting
    );
    calculateSubtotal(
      elements.scoreCompetencies,
      elements.subtotalScoreCompetencies
    );
    calculateSubtotal(elements.weightKPI, elements.subtotalWeightKPI);
    calculateSubtotal(elements.selfRatingKPI, elements.subtotalSelfRatingKPI);
    calculateSubtotal(elements.reportingKPI, elements.subtotalReportingKPI);
    calculateSubtotal(elements.scoreKPI, elements.subtotalScoreKPI);

    updateAggregatedScore();
  };

  // Calculate aggregated score
  const updateAggregatedScore = () => {
    const subtotalCompetencies =
      parseFloat(elements.subtotalScoreCompetencies.textContent) || 0;
    const subtotalKPI = parseFloat(elements.subtotalScoreKPI.textContent) || 0;
    const misconductPenalty =
      parseFloat(elements.WarningForMisconduct.value) || 0;
    const attendancePenalty =
      parseFloat(elements.WarningForAttendance.value) || 0;
    const additionalScore = parseFloat(elements.AdditionalScore.value) || 0;

    const accumulationScore = subtotalCompetencies + subtotalKPI;
    const finalScore =
      accumulationScore -
      misconductPenalty -
      attendancePenalty +
      additionalScore;

    elements.scoreAccumulation.textContent = accumulationScore.toFixed(2);
    elements.AggregatedScore.textContent = finalScore.toFixed(2);
  };

  // Helper to debounce input events
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Add event listeners for inputs
  const attachListeners = (inputs, callback) => {
    inputs.forEach((input) => {
      input.addEventListener("input", debounce(callback, 300));
    });
  };

  // Attach event listeners for dynamic recalculation
  attachListeners(elements.selfRatingCompetencies, updateScoresAndSubtotals);
  attachListeners(elements.reportingCompetencies, updateScoresAndSubtotals);
  attachListeners(elements.selfRatingKPI, updateScoresAndSubtotals);
  attachListeners(elements.reportingKPI, updateScoresAndSubtotals);
  attachListeners(
    [
      elements.WarningForMisconduct,
      elements.WarningForAttendance,
      elements.AdditionalScore,
    ],
    updateAggregatedScore
  );

  // Initial calculation
  updateScoresAndSubtotals();

  // Get the "Add More Development Plan" element
  const addDevelopmentPlan = document.getElementById("addDevelopmentPlan");

  // Attach a click event listener
  addDevelopmentPlan.addEventListener("click", () => {
    // Find the tbody of the table
    const tbody = addDevelopmentPlan.closest("table").querySelector("tbody");

    // Create a new row with the same structure
    const newRow = document.createElement("tr");
    // const rowNumber = tbody.querySelectorAll("tr").length + 1;
    // let serialNumber = 1;
    // for (i = 0; i < rowNumber; i++) {
    //   serialNumber = i;
    // }
    // <td>` +
    //   serialNumber +
    //   `.</td>
    newRow.innerHTML = `
      <td>
        <textarea class="form-control d-flex"></textarea>
      </td>
      <td width="25%" data-provide="datepicker">
        <input
          type=""
          class="form-control text-center singledate"
          id="daterange"
          placeholder="End Date"
        />
      </td>
      <td width="15%">
        <button type="button" class="btn btn-danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash3"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
            />
          </svg>
        </button>
      </td>
    `;

    // Append the new row to the tbody
    tbody.appendChild(newRow);

    // Reinitialize daterangepicker for the new input
    $(newRow.querySelector(".singledate"))
      .daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
          format: "YYYY-MM-DD",
        },
        autoUpdateInput: false,
      })
      .on("apply.daterangepicker", function (e, picker) {
        picker.element.val(picker.startDate.format(picker.locale.format));
      });

    // Optionally: Add functionality to remove the row using the delete button
    newRow.querySelector(".btn-danger").addEventListener("click", () => {
      // newRow.remove();
      deleteRow(newRow);
    });
  });

  // Function to delete a row
  function deleteRow(row) {
    const tbody = row.closest("tbody");
    if (tbody.querySelectorAll("tr").length > 1) {
      row.remove();
    } else {
      alert("Cannot delete the last row.");
    }
  }

  // Add delete functionality to the initial delete button(s)
  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", function () {
      deleteRow(this.closest("tr"));
    });
  });

  // Print functionality
  // document.getElementById("printForm").addEventListener("click", () => {
  //   window.print();
  // });

  $(".singledate")
    .daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale: {
        format: "YYYY-MM-DD",
      },
      autoUpdateInput: false,
    })
    .on("apply.daterangepicker", function (e, picker) {
      picker.element.val(picker.startDate.format(picker.locale.format));
    });
});
