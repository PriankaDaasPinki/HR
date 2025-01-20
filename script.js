document.addEventListener("DOMContentLoaded", () => {
  const weightCompetenciesCells = document.querySelectorAll(
    ".weightCompetencies"
  );
  const subtotalWeightCompetenciesCell = document.querySelector(
    "#subtotalWeightCompetencies"
  );

  const selfRatingCompetenciesCells = document.querySelectorAll(".selfRating");
  const subtotalSelfRatingCell = document.querySelector("#subtotalSelfRating");

  const reportingCompetenciesCells = document.querySelectorAll(
    ".reportingCompetencies"
  );
  const subtotalReportingCell = document.querySelector("#subtotalReporting");

  const scoreCompetenciesCells =
    document.querySelectorAll(".scoreCompetencies");
  const subtotalScoreCompetenciesCell = document.querySelector(
    "#subtotalScoreCompetencies"
  );

  // Construct competencies dynamically
  const competencies = Array.from(weightCompetenciesCells).map(
    (weightCell, index) => ({
      weight: weightCell,
      selfRating: selfRatingCompetenciesCells[index].querySelector("input"),
      reporting: reportingCompetenciesCells[index].querySelector("input"),
      score: scoreCompetenciesCells[index],
    })
  );

  function sum(cells, subtotalCell) {
    const subtotal = Array.from(cells).reduce((acc, cell) => {
      const value = parseFloat(cell.value || cell.textContent) || 0;
      return acc + value;
    }, 0);
    subtotalCell.textContent = subtotal.toFixed(2);
  }

  function calculateScore(weightCell, reportingInput, scoreCell) {
    const weight = parseFloat(weightCell.textContent) || 0;
    const reporting = parseFloat(reportingInput.value) || 0;
    const score = (weight * reporting) / 100;
    scoreCell.textContent = score.toFixed(2);
  }

  function updateAllScores() {
    competencies.forEach(({ weight, reporting, score }) => {
      calculateScore(weight, reporting, score);
    });
  }

  function updateAllSums() {
    sum(weightCompetenciesCells, subtotalWeightCompetenciesCell);
    sum(
      Array.from(selfRatingCompetenciesCells).map((cell) =>
        cell.querySelector("input")
      ),
      subtotalSelfRatingCell
    );
    //   sum(selfRatingCompetenciesCells, subtotalSelfRatingCell);
    sum(
      Array.from(reportingCompetenciesCells).map((cell) =>
        cell.querySelector("input")
      ),
      subtotalReportingCell
    );
    sum(scoreCompetenciesCells, subtotalScoreCompetenciesCell);
  }

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Initial calculation
  updateAllSums();
  updateAllScores();

  // Add event listeners to self-rating inputs for recalculations
  selfRatingCompetenciesCells.forEach((cell) => {
    const input = cell.querySelector("input");
    if (input) {
      input.addEventListener(
        "input",
        debounce(() => {
          updateAllSums();
        }, 300)
      );
    }
  });

  // Add event listeners to recalculate dynamically with debounce
  reportingCompetenciesCells.forEach((cell) => {
    const input = cell.querySelector("input");
    if (input) {
      input.addEventListener(
        "input",
        debounce(() => {
          updateAllScores();
          updateAllSums();
        }, 300)
      );
    }
  });
});
