function randomLatency() {
  return Math.floor(Math.random() * 260) + 150;
}
function analyzeDatasetSummary(text) {
  const lower = text.toLowerCase();
  const findings = [];
  if (lower.includes("80%") || lower.includes("majority")) {
    findings.push("Class imbalance detected — one group appears to make up the majority of the dataset. This can skew model performance.");
  }
  if (lower.includes("gender") || lower.includes("male") || lower.includes("female")) {
    findings.push("Gender attribute present. Ensure you have a clear rationale for including or excluding sensitive attributes in modeling.");
  }
  if (lower.includes("income") || lower.includes("zip code")) {
    findings.push("Proxies for socioeconomic status detected (e.g., income, location). These can introduce indirect bias and should be stress tested.");
  }
  if (!findings.length) {
    findings.push("No obvious red flags detected in this short description. A real bias audit would require row-level analysis and fairness metrics.");
  }
  return findings;
}
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("mainInput");
  const sampleBtn = document.getElementById("sampleBtn");
  const clearBtn = document.getElementById("clearBtn");
  const runBtn = document.getElementById("runBtn");
  const extraControls = document.getElementById("extraControls");
  const outputPanel = document.getElementById("outputPanel");
  const outputBody = document.getElementById("outputBody");
  const metricConfidence = document.getElementById("metricConfidence");
  const metricLatency = document.getElementById("metricLatency");
  const metricPattern = document.getElementById("metricPattern");
  extraControls.innerHTML = `
    <div class="field">
      <label for="useCase">Model use case</label>
      <input id="useCase" placeholder="e.g., Loan approvals, hiring recommendations, risk scoring" />
    </div>
  `;
  const useCaseInput = document.getElementById("useCase");
  sampleBtn.addEventListener("click", () => {
    input.value = "Dataset of 50,000 historical loan applications: 80% of applicants are from region A, 20% from region B. Features include age, income band, employment length, credit score, and postal code.";
    useCaseInput.value = "Loan approval model";
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    useCaseInput.value = "";
    outputBody.innerHTML = "<p>Describe your dataset at a high level and the model use case to see a simulated bias risk review.</p>";
    outputPanel.querySelector(".output-header").innerHTML = '<span>Awaiting input...</span><span class="chip">No run yet</span>';
    metricConfidence.textContent = "-";
    metricLatency.textContent = "-";
    metricPattern.textContent = "-";
  });
  runBtn.addEventListener("click", () => {
    const text = input.value;
    const useCase = useCaseInput.value || "General predictive model";
    const findings = analyzeDatasetSummary(text);
    const latency = randomLatency();
    outputPanel.querySelector(".output-header").innerHTML =
      '<span>Bias review summary (simulated)</span><span class="chip">Responsible AI lens</span>';
    let bodyHtml = "";
    bodyHtml += "<p><strong>Use Case</strong><br>" + useCase + "</p>";
    bodyHtml += "<p><strong>Key Observations</strong></p><ul>";
    findings.forEach(f => { bodyHtml += "<li>" + f + "</li>"; });
    bodyHtml += "</ul>";
    bodyHtml += "<p><strong>Suggested next steps</strong></p>";
    bodyHtml += "<p>• Run quantitative fairness metrics (e.g., demographic parity, equal opportunity) across protected groups.<br>" +
                "• Engage Legal and Risk teams early to validate acceptable trade-offs.<br>" +
                "• Capture decisions in a model card or governance registry within your AI platform.</p>";
    outputBody.innerHTML = bodyHtml;
    metricConfidence.textContent = "N/A (heuristic)";
    metricLatency.textContent = latency.toString();
    metricPattern.textContent = "Governance • Bias Pre-Check";
  });
});