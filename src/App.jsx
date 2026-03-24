import { useMemo, useState } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COEFFICIENTS = {
  mangrove: 1000,
  seagrass: 600,
  saltMarsh: 900,
  wetland: 700,
};

const COUNTRIES = [
  {
    name: "Nigeria",
    region: "West Africa",
    states: [
      { name: "Bayelsa", coastalArea: 820000, mangrove: 245000, seagrass: 12000, saltMarsh: 9000, wetland: 178000, restorationPotential: 42000, deforestationRate: 3.8, fishery: "High", industrial: "Medium", pollution: "High" },
      { name: "Rivers", coastalArea: 640000, mangrove: 168000, seagrass: 9000, saltMarsh: 7000, wetland: 124000, restorationPotential: 30000, deforestationRate: 4.2, fishery: "High", industrial: "High", pollution: "High" },
      { name: "Delta", coastalArea: 700000, mangrove: 185000, seagrass: 11000, saltMarsh: 8000, wetland: 146000, restorationPotential: 34000, deforestationRate: 3.6, fishery: "High", industrial: "High", pollution: "High" },
      { name: "Lagos", coastalArea: 310000, mangrove: 32000, seagrass: 5500, saltMarsh: 4500, wetland: 52000, restorationPotential: 12000, deforestationRate: 2.1, fishery: "Medium", industrial: "High", pollution: "High" },
      { name: "Akwa Ibom", coastalArea: 380000, mangrove: 76000, seagrass: 6500, saltMarsh: 5000, wetland: 68000, restorationPotential: 15000, deforestationRate: 2.8, fishery: "High", industrial: "Medium", pollution: "Medium" },
      { name: "Cross River", coastalArea: 290000, mangrove: 91000, seagrass: 4200, saltMarsh: 3300, wetland: 72000, restorationPotential: 18000, deforestationRate: 2.5, fishery: "Medium", industrial: "Low", pollution: "Medium" },
      { name: "Ondo", coastalArea: 260000, mangrove: 47000, seagrass: 3900, saltMarsh: 2800, wetland: 56000, restorationPotential: 11000, deforestationRate: 2.9, fishery: "Medium", industrial: "Medium", pollution: "Medium" },
    ],
  },
  {
    name: "Ghana",
    region: "West Africa",
    states: [
      { name: "Western Region", coastalArea: 220000, mangrove: 21000, seagrass: 4500, saltMarsh: 3100, wetland: 47000, restorationPotential: 7600, deforestationRate: 2.2, fishery: "High", industrial: "Medium", pollution: "Medium" },
      { name: "Greater Accra", coastalArea: 140000, mangrove: 9000, seagrass: 2300, saltMarsh: 1800, wetland: 22000, restorationPotential: 4200, deforestationRate: 1.9, fishery: "Medium", industrial: "High", pollution: "High" },
    ],
  },
  {
    name: "Senegal",
    region: "West Africa",
    states: [
      { name: "Saint-Louis", coastalArea: 165000, mangrove: 18000, seagrass: 3200, saltMarsh: 4800, wetland: 41000, restorationPotential: 6800, deforestationRate: 1.7, fishery: "High", industrial: "Low", pollution: "Medium" },
      { name: "Ziguinchor", coastalArea: 190000, mangrove: 36000, seagrass: 4100, saltMarsh: 5300, wetland: 52000, restorationPotential: 8500, deforestationRate: 1.5, fishery: "High", industrial: "Low", pollution: "Low" },
    ],
  },
  {
    name: "Kenya",
    region: "East Africa",
    states: [
      { name: "Mombasa", coastalArea: 120000, mangrove: 14000, seagrass: 7800, saltMarsh: 1600, wetland: 19000, restorationPotential: 3500, deforestationRate: 1.8, fishery: "Medium", industrial: "Medium", pollution: "Medium" },
      { name: "Lamu", coastalArea: 210000, mangrove: 52000, seagrass: 10200, saltMarsh: 2600, wetland: 31000, restorationPotential: 9200, deforestationRate: 1.4, fishery: "High", industrial: "Low", pollution: "Low" },
    ],
  },
  {
    name: "Indonesia",
    region: "Global",
    states: [
      { name: "Papua", coastalArea: 980000, mangrove: 315000, seagrass: 25000, saltMarsh: 9000, wetland: 220000, restorationPotential: 52000, deforestationRate: 2.6, fishery: "High", industrial: "Medium", pollution: "Medium" },
      { name: "Riau Islands", coastalArea: 410000, mangrove: 64000, seagrass: 13000, saltMarsh: 4200, wetland: 68000, restorationPotential: 16000, deforestationRate: 2.3, fishery: "High", industrial: "High", pollution: "High" },
    ],
  },
];

const FOCUS_LOCATIONS = [
  { label: "Bayelsa", top: "52%", left: "41%", status: "High Carbon Hotspot" },
  { label: "Lagos", top: "48%", left: "33%", status: "Urban Risk Pressure" },
  { label: "Cross River", top: "58%", left: "53%", status: "Restoration Ready" },
  { label: "Lamu", top: "44%", left: "69%", status: "Blue Economy Growth" },
];

const levelScore = { Low: 1, Medium: 2, High: 3 };

const initialState = COUNTRIES[0].states[0];

const initialForm = {
  country: "Nigeria",
  stateRegion: initialState.name,
  coastalAreaSize: initialState.coastalArea,
  mangroveCoverage: initialState.mangrove,
  seagrassCoverage: initialState.seagrass,
  saltMarshCoverage: initialState.saltMarsh,
  wetlandCoverage: initialState.wetland,
  deforestationRate: initialState.deforestationRate,
  restorationPotential: initialState.restorationPotential,
  fisheryActivity: initialState.fishery,
  industrialActivity: initialState.industrial,
  pollutionLevel: initialState.pollution,
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusTone(value, reverse = false) {
  if (reverse) {
    if (value >= 70) return "text-rose-300 bg-rose-500/15";
    if (value >= 40) return "text-amber-200 bg-amber-500/15";
    return "text-emerald-200 bg-emerald-500/15";
  }
  if (value >= 70) return "text-emerald-200 bg-emerald-500/15";
  if (value >= 40) return "text-amber-200 bg-amber-500/15";
  return "text-rose-200 bg-rose-500/15";
}

function riskBand(score) {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  if (score >= 20) return "Low";
  return "Very Low";
}

function generateAnalysis(form) {
  const ecosystemStocks = {
    mangrove: form.mangroveCoverage * COEFFICIENTS.mangrove,
    seagrass: form.seagrassCoverage * COEFFICIENTS.seagrass,
    saltMarsh: form.saltMarshCoverage * COEFFICIENTS.saltMarsh,
    wetland: form.wetlandCoverage * COEFFICIENTS.wetland,
  };

  const totalCarbonStock = Object.values(ecosystemStocks).reduce((sum, value) => sum + value, 0);
  const annualSequestration = totalCarbonStock * 0.042;
  const riskScore = Math.min(
    100,
    form.deforestationRate * 9 +
    levelScore[form.industrialActivity] * 12 +
    levelScore[form.pollutionLevel] * 10 +
    levelScore[form.fisheryActivity] * 6
  );
  const carbonLossRisk = totalCarbonStock * (riskScore / 100) * 0.12;
  const restorationCarbonPotential = form.restorationPotential * 850;
  const netBlueCarbonValue = totalCarbonStock + restorationCarbonPotential - carbonLossRisk;
  const climateImpactScore = Math.min(100, (netBlueCarbonValue / Math.max(form.coastalAreaSize, 1)) * 0.12);
  const investmentPotential = Math.min(
    100,
    climateImpactScore * 0.52 +
    (form.restorationPotential / Math.max(form.coastalAreaSize, 1)) * 900 +
    (100 - riskScore) * 0.34
  );

  const carbonCredits = netBlueCarbonValue;
  const annualRevenuePotential = annualSequestration * 10;
  const tenYearClimateFinanceValue = annualRevenuePotential * 10;
  const marketValue = carbonCredits * 10;
  const restorationCostEstimate = form.restorationPotential * 220;
  const expectedEconomicReturn = marketValue + tenYearClimateFinanceValue - restorationCostEstimate;

  const indicators = {
    coastalErosion: riskBand(riskScore - 6 + levelScore[form.industrialActivity] * 4),
    seaLevelRise: riskBand(48 + form.deforestationRate * 5),
    mangroveLoss: riskBand(riskScore + levelScore[form.pollutionLevel] * 3),
    pollution: riskBand(levelScore[form.pollutionLevel] * 25 + levelScore[form.industrialActivity] * 8),
    industrialPressure: riskBand(levelScore[form.industrialActivity] * 25 + 10),
  };

  const topEcosystem = Object.entries(ecosystemStocks).sort((a, b) => b[1] - a[1])[0][0];
  const policyRecommendations = buildRecommendations(form, {
    riskScore,
    topEcosystem,
    carbonCredits,
    netBlueCarbonValue,
  });

  return {
    ecosystemStocks,
    totalCarbonStock,
    annualSequestration,
    carbonLossRisk,
    restorationCarbonPotential,
    netBlueCarbonValue,
    riskScore,
    climateImpactScore,
    investmentPotential,
    carbonCredits,
    annualRevenuePotential,
    tenYearClimateFinanceValue,
    marketValue,
    restorationCostEstimate,
    expectedEconomicReturn,
    indicators,
    policyRecommendations,
  };
}

function buildRecommendations(form, metrics) {
  const status =
    metrics.netBlueCarbonValue > 100000000
      ? "Strategic National Carbon Asset"
      : "Emerging Blue Carbon Opportunity";

  const environmentalRisk =
    metrics.riskScore >= 60
      ? "High development and pollution pressure require urgent coastal safeguards."
      : "Manageable risk profile with strong room for resilience-building investments.";

  const ecosystemLabel = {
    mangrove: "mangrove forests",
    seagrass: "seagrass meadows",
    saltMarsh: "salt marsh systems",
    wetland: "coastal wetlands",
  }[metrics.topEcosystem];

  return {
    blueCarbonStatus: status,
    environmentalRisk,
    policyRecommendations: [
      `Protect high-value ${ecosystemLabel} through enforceable coastal zoning and habitat monitoring.`,
      "Mainstream blue carbon accounting into climate action plans, state budgets, and coastal permitting.",
      "Develop a carbon MRV framework for state agencies, universities, and community conservation groups.",
    ],
    conservationStrategy: `Prioritize conservation corridors across ${form.stateRegion} to reduce fragmentation and prevent ecosystem conversion.`,
    restorationPlan: `Restore ${formatNumber(form.restorationPotential)} hectares using community-led mangrove and wetland rehabilitation programs.`,
    investmentOpportunities: "Package blue carbon projects for blended finance, resilience bonds, adaptation funds, and voluntary carbon markets.",
    carbonCreditPotential: `${formatNumber(metrics.carbonCredits)} credits could support a phased carbon credit program at $10 per ton.`,
    governmentActionPlan: "Create a cross-ministerial blue carbon task force linking marine economy, environment, finance, and climate agencies.",
    communityEngagementStrategy: "Support fisher cooperatives, youth restoration jobs, and local stewardship agreements for long-term ecosystem protection.",
  };
}

function ChartCard({ title, subtitle, data }) {
  const chartData = {
    labels: ["Mangrove", "Seagrass", "Salt Marsh", "Wetland"],
    datasets: [
      {
        data: [data.mangrove, data.seagrass, data.saltMarsh, data.wetland],
        backgroundColor: ["#43c684", "#38afee", "#f59e0b", "#7dd3fc"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#dcecf7",
          padding: 16,
        },
      },
    },
  };

  return (
    <div className="glass-panel rounded-3xl p-6 metric-glow">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.35em] text-ocean-200/80">{title}</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{subtitle}</h3>
      </div>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}

function MetricCard({ label, value, hint, tone }) {
  return (
    <div className="glass-panel rounded-3xl p-5 metric-glow">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-300">{hint}</p>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="glass-panel rounded-3xl p-6 fade-up">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function FormInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-ocean-300"
      />
    </label>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-ocean-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FinanceCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-slate-300">{title}</p>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

function RecommendationRow({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm uppercase tracking-[0.28em] text-ocean-200/90">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-200">{text}</div>
    </div>
  );
}

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState("Nigeria");
  const [form, setForm] = useState(initialForm);
  const [analysis, setAnalysis] = useState(generateAnalysis(initialForm));

  const activeCountry = useMemo(
    () => COUNTRIES.find((country) => country.name === selectedCountry) ?? COUNTRIES[0],
    [selectedCountry]
  );

  const handleCountryChange = (countryName) => {
    const country = COUNTRIES.find((item) => item.name === countryName) ?? COUNTRIES[0];
    const state = country.states[0];
    setSelectedCountry(country.name);
    setForm({
      country: country.name,
      stateRegion: state.name,
      coastalAreaSize: state.coastalArea,
      mangroveCoverage: state.mangrove,
      seagrassCoverage: state.seagrass,
      saltMarshCoverage: state.saltMarsh,
      wetlandCoverage: state.wetland,
      deforestationRate: state.deforestationRate,
      restorationPotential: state.restorationPotential,
      fisheryActivity: state.fishery,
      industrialActivity: state.industrial,
      pollutionLevel: state.pollution,
    });
  };

  const handleStateChange = (stateName) => {
    const state = activeCountry.states.find((item) => item.name === stateName);
    if (!state) return;
    setForm({
      country: activeCountry.name,
      stateRegion: state.name,
      coastalAreaSize: state.coastalArea,
      mangroveCoverage: state.mangrove,
      seagrassCoverage: state.seagrass,
      saltMarshCoverage: state.saltMarsh,
      wetlandCoverage: state.wetland,
      deforestationRate: state.deforestationRate,
      restorationPotential: state.restorationPotential,
      fisheryActivity: state.fishery,
      industrialActivity: state.industrial,
      pollutionLevel: state.pollution,
    });
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const calculate = () => {
    setAnalysis(generateAnalysis(form));
    document.getElementById("results-dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reportLines = useMemo(
    () => [
      { label: "Location", value: `${form.stateRegion}, ${form.country}` },
      { label: "Ecosystem Data", value: `Mangrove ${formatNumber(form.mangroveCoverage)} ha, Wetlands ${formatNumber(form.wetlandCoverage)} ha` },
      { label: "Carbon Assessment", value: `${formatNumber(analysis.totalCarbonStock)} tons CO2 stock with ${formatNumber(analysis.annualSequestration)} tons annual sequestration` },
      { label: "Risk Analysis", value: `${riskBand(analysis.riskScore)} risk driven by deforestation, pollution, and industry pressure` },
      { label: "Policy Recommendations", value: analysis.policyRecommendations.policyRecommendations[0] },
      { label: "Investment Opportunities", value: `${formatMoney(analysis.marketValue)} market value and ${formatMoney(analysis.expectedEconomicReturn)} estimated return` },
      { label: "Carbon Credit Value", value: `${formatNumber(analysis.carbonCredits)} credits valued at ${formatMoney(analysis.marketValue)}` },
      { label: "Conclusion", value: `${form.stateRegion} shows ${analysis.policyRecommendations.blueCarbonStatus.toLowerCase()} for climate resilience and blue economy planning.` },
    ],
    [analysis, form]
  );

  return (
    <div>
      <header className="hero-grid section-shell">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="fade-up">
              <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Blue Carbon Assessment Platform</p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
                Assessing Carbon Stock in Coastal and Marine Ecosystems
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                A platform designed for decision support for governments, researchers, academia, NGOs, investors, and environmental agencies to assess blue carbon potentialwithin Nigerian coastal states, across Africa, and  globally.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#assessment-tool" className="rounded-full bg-mangrove-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-mangrove-300">
                  Start Assessment
                </a>
                <a href="#results-dashboard" className="rounded-full border border-ocean-200/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                  View Dashboard
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <MetricCard label="Coverage" value="Global to Local" hint="Global, regional, and Nigeria coastal intelligence." tone="text-ocean-200 bg-ocean-500/15" />
                <MetricCard label="Engine" value="Simulated MVP" hint="Mock datasets, formulas, charts, and report generation." tone="text-mangrove-200 bg-mangrove-500/15" />
                <MetricCard label="Focus" value="Policy + Finance" hint="Links ecosystem health to climate policy and investment." tone="text-amber-200 bg-amber-500/15" />
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6 shadow-glow fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Hotspot Overview</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Map-style Blue Carbon Intelligence</h2>
                </div>
                <div className="rounded-full bg-ocean-400/15 px-4 py-2 text-xs text-ocean-100">Interactive MVP View</div>
              </div>

              <div className="relative mt-6 h-[380px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(28,110,156,0.68),rgba(7,31,48,0.9))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_60%_75%,rgba(34,197,94,0.18),transparent_20%)]" />
                <div className="absolute inset-6 rounded-[1.5rem] border border-white/10 bg-slate-900/20" />
                {FOCUS_LOCATIONS.map((item) => (
                  <div key={item.label} className="absolute" style={{ top: item.top, left: item.left }}>
                    <div className="map-dot h-3 w-3 rounded-full bg-cyan-300" />
                    <div className="mt-3 w-40 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-100">
                      <div className="font-semibold">{item.label}</div>
                      <div className="mt-1 text-slate-300">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Highest stock density</p>
                  <div className="mt-2 text-lg font-semibold text-white">Bayelsa, Nigeria</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Fastest finance case</p>
                  <div className="mt-2 text-lg font-semibold text-white">Lamu, Kenya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="What is Blue Carbon" text="Blue carbon refers to the carbon stored in marine and coastal ecosystems such as mangroves, seagrass meadows, wetlands, and salt marshes that support climate mitigation and biodiversity." />
          <InfoCard title="Ecosystems Covered" text="This MVP models carbon storage potential across mangroves, seagrass, salt marshes, and wetlands, with emphasis on coastal and deltaic landscapes." />
          <InfoCard title="Carbon Assessment Tool" text="Users can enter ecosystem extent, land-use pressure, restoration potential, and activity levels to estimate stock, sequestration, risk, and credit potential." />
          <InfoCard title="Policy and Investment Insights" text="The platform turns ecological inputs into policy recommendations, risk indicators, climate finance estimates, and restoration priorities." />
        </section>

        <section id="assessment-tool" className="section-shell mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Blue Carbon Assessment Tool</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Assessment Input Form</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Select a coastal country and state or region, then refine the simulated ecosystem and pressure data to estimate blue carbon potential.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <FormSelect label="Country" value={selectedCountry} onChange={(event) => handleCountryChange(event.target.value)} options={COUNTRIES.map((country) => country.name)} />
              <FormSelect label="State/Region" value={form.stateRegion} onChange={(event) => handleStateChange(event.target.value)} options={activeCountry.states.map((state) => state.name)} />
              <FormInput label="Coastal Area Size (ha)" value={form.coastalAreaSize} onChange={(event) => updateField("coastalAreaSize", Number(event.target.value))} />
              <FormInput label="Mangrove Coverage (ha)" value={form.mangroveCoverage} onChange={(event) => updateField("mangroveCoverage", Number(event.target.value))} />
              <FormInput label="Seagrass Coverage (ha)" value={form.seagrassCoverage} onChange={(event) => updateField("seagrassCoverage", Number(event.target.value))} />
              <FormInput label="Salt Marsh Coverage (ha)" value={form.saltMarshCoverage} onChange={(event) => updateField("saltMarshCoverage", Number(event.target.value))} />
              <FormInput label="Wetland Coverage (ha)" value={form.wetlandCoverage} onChange={(event) => updateField("wetlandCoverage", Number(event.target.value))} />
              <FormInput label="Deforestation Rate (%)" value={form.deforestationRate} onChange={(event) => updateField("deforestationRate", Number(event.target.value))} />
              <FormInput label="Restoration Potential (ha)" value={form.restorationPotential} onChange={(event) => updateField("restorationPotential", Number(event.target.value))} />
              <FormSelect label="Fishery Activity" value={form.fisheryActivity} onChange={(event) => updateField("fisheryActivity", event.target.value)} options={["Low", "Medium", "High"]} />
              <FormSelect label="Industrial Activity" value={form.industrialActivity} onChange={(event) => updateField("industrialActivity", event.target.value)} options={["Low", "Medium", "High"]} />
              <FormSelect label="Pollution Level" value={form.pollutionLevel} onChange={(event) => updateField("pollutionLevel", event.target.value)} options={["Low", "Medium", "High"]} />
            </div>

            <button onClick={calculate} className="mt-8 w-full rounded-2xl bg-gradient-to-r from-ocean-400 to-mangrove-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:brightness-110">
              Calculate Blue Carbon Potential
            </button>
          </div>

          <div className="grid gap-6">
            <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-mangrove-200">Nigeria / Coastal States Intelligence</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Automated Strategy Suggestions</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Predefined data powers tailored intervention ideas for Nigerian coastal states and selected coastal regions in Ghana, Senegal, Kenya, and Indonesia.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Mangrove restoration",
                  "Wetland conservation",
                  "Fisheries sustainability",
                  "Marine protection",
                  "Climate adaptation strategies",
                  "Carbon market readiness",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Preset Country Scope" value={`${COUNTRIES.length} Countries`} hint="Nigeria plus four additional coastal countries." tone="text-ocean-200 bg-ocean-500/15" />
              <MetricCard label="Nigeria Coverage" value="7 States" hint="Bayelsa, Rivers, Delta, Lagos, Akwa Ibom, Cross River, and Ondo." tone="text-mangrove-200 bg-mangrove-500/15" />
            </div>
          </div>
        </section>

        <section id="results-dashboard" className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Results Dashboard</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Blue Carbon Analysis for {form.stateRegion}, {form.country}</h2>
            </div>
            <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusTone(analysis.riskScore, true)}`}>
              Risk Level: {riskBand(analysis.riskScore)}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total Blue Carbon Stock" value={`${formatNumber(analysis.totalCarbonStock)} tCO2`} hint="Combined stock across mangroves, seagrass, salt marsh, and wetlands." tone={statusTone(analysis.climateImpactScore)} />
            <MetricCard label="Annual Sequestration" value={`${formatNumber(analysis.annualSequestration)} tCO2`} hint="Estimated annual carbon capture across assessed ecosystems." tone="text-ocean-200 bg-ocean-500/15" />
            <MetricCard label="Carbon Loss Risk" value={`${formatNumber(analysis.carbonLossRisk)} tCO2`} hint="Projected stock at risk under current ecological pressure." tone={statusTone(analysis.riskScore, true)} />
            <MetricCard label="Climate Impact Score" value={`${analysis.climateImpactScore.toFixed(0)}/100`} hint="Overall climate mitigation strength of this coastal landscape." tone={statusTone(analysis.climateImpactScore)} />
            <MetricCard label="Investment Potential" value={`${analysis.investmentPotential.toFixed(0)}/100`} hint="Blended readiness for climate finance and blue carbon investment." tone={statusTone(analysis.investmentPotential)} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard title="Ecosystem Contribution Chart" subtitle="Relative contribution to carbon stock" data={analysis.ecosystemStocks} />

            <div className="grid gap-6">
              <div className="glass-panel rounded-3xl p-6 metric-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Climate Risk Indicator</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Pressure and resilience signals</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {Object.entries(analysis.indicators).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm capitalize text-slate-300">{key.replace(/([A-Z])/g, " $1")}</div>
                      <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${value.includes("High") ? "bg-rose-500/15 text-rose-200" : value === "Medium" ? "bg-amber-500/15 text-amber-200" : "bg-emerald-500/15 text-emerald-200"}`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 metric-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-mangrove-200">Blue Carbon Investment Module</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Carbon credit and finance outlook</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <FinanceCard title="Total Carbon Credits" value={formatNumber(analysis.carbonCredits)} />
                  <FinanceCard title="Annual Revenue Potential" value={formatMoney(analysis.annualRevenuePotential)} />
                  <FinanceCard title="10-Year Climate Finance Value" value={formatMoney(analysis.tenYearClimateFinanceValue)} />
                  <FinanceCard title="Blue Carbon Market Value" value={formatMoney(analysis.marketValue)} />
                  <FinanceCard title="Restoration Cost Estimate" value={formatMoney(analysis.restorationCostEstimate)} />
                  <FinanceCard title="Expected Economic Return" value={formatMoney(analysis.expectedEconomicReturn)} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-ocean-200">Policy Recommendation Engine</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Decision support outputs</h2>
            <div className="mt-6 grid gap-4">
              <RecommendationRow title="Blue Carbon Status" text={analysis.policyRecommendations.blueCarbonStatus} />
              <RecommendationRow title="Environmental Risk" text={analysis.policyRecommendations.environmentalRisk} />
              <RecommendationRow title="Policy Recommendations" text={analysis.policyRecommendations.policyRecommendations.join(" ")} />
              <RecommendationRow title="Conservation Strategy" text={analysis.policyRecommendations.conservationStrategy} />
              <RecommendationRow title="Restoration Plan" text={analysis.policyRecommendations.restorationPlan} />
              <RecommendationRow title="Investment Opportunities" text={analysis.policyRecommendations.investmentOpportunities} />
              <RecommendationRow title="Carbon Credit Potential" text={analysis.policyRecommendations.carbonCreditPotential} />
              <RecommendationRow title="Government Action Plan" text={analysis.policyRecommendations.governmentActionPlan} />
              <RecommendationRow title="Community Engagement Strategy" text={analysis.policyRecommendations.communityEngagementStrategy} />
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-mangrove-200">Report Generator</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Blue Carbon Assessment Report</h2>
              </div>
              <button
                onClick={() => window.alert("Mock PDF download triggered for the MVP report.")}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Download PDF
              </button>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
              {reportLines.map((item) => (
                <div key={item.label} className="border-b border-white/10 py-4 last:border-b-0">
                  <div className="text-sm uppercase tracking-[0.28em] text-ocean-200/90">{item.label}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-200">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <div className="text-sm uppercase tracking-[0.22em] text-ocean-100/90">
            Built by Thompson Smooth OKOYEN | Sponsored by Bayelsa State Ministry of Marine and Blue Economy
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-200">
            {[
              "UNFCCC",
              "Federal Ministry of Marine and Blue Economy",
              "National Council on Climate Change",
              "Government of Bayelsa State",
            ].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
