"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";

type Settings = {
  ai_provider: string;
  ai_model: string;
  max_output_tokens: number;
  retry_failed_generations: boolean;
  retry_count: number;
  cv_output_format: string;
  preferred_cv_length: string;
  preferred_cv_format: string;
  include_professional_summary: boolean;
  include_certifications: boolean;
  language_variant: string;
  preserve_employment_dates: boolean;
  preferred_job_titles: string[];
  preferred_locations: string[];
  employment_types: string[];
  work_modes: string[];
  salary_min: number | null;
  salary_max: number | null;
  notify_new_jobs: boolean;
  notify_tailoring_complete: boolean;
  notify_tailoring_failed: boolean;
  notify_application_reminders: boolean;
};

const defaults: Settings = {
  ai_provider: "OpenRouter",
  ai_model: "openrouter/free",
  max_output_tokens: 4096,
  retry_failed_generations: true,
  retry_count: 2,
  cv_output_format: "structured",
  preferred_cv_length: "1-2 pages",
  preferred_cv_format: "PDF",
  include_professional_summary: true,
  include_certifications: true,
  language_variant: "UK English",
  preserve_employment_dates: true,
  preferred_job_titles: [
    "Data Scientist",
    "ML Engineer",
    "Data Analyst",
  ],
  preferred_locations: ["Dubai, UAE"],
  employment_types: ["Full-time"],
  work_modes: ["On-site", "Hybrid", "Remote"],
  salary_min: null,
  salary_max: null,
  notify_new_jobs: true,
  notify_tailoring_complete: true,
  notify_tailoring_failed: true,
  notify_application_reminders: true,
};

const API = "http://localhost:8000/api/settings";

const field =
  "h-[38px] w-full rounded-[10px] border border-[#d9deeb] bg-white px-4 text-sm text-[#111936] shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const label = "text-[14px] font-medium text-[#111936]";

function Toggle({
  labelText,
  checked,
  onChange,
  info = false,
}: {
  labelText: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  info?: boolean;
}) {
  return (
    <div className="flex min-h-[45px] items-center justify-between gap-4 border-b border-[#e7e9f1] px-1 py-2 last:border-0">
      <span className={label}>
        {labelText}
        {info && (
          <span
            title="Applied when CareerPilot prepares your CV."
            className="ml-2 inline-flex h-[17px] w-[17px] items-center justify-center rounded-full border border-slate-400 text-[11px] text-slate-500"
          >
            i
          </span>
        )}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={labelText}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-[45px] shrink-0 rounded-full transition ${
          checked ? "bg-[#7028f4]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}

function Row({
  title,
  children,
  info = false,
}: {
  title: string;
  children: React.ReactNode;
  info?: boolean;
}) {
  return (
    <div className="grid min-h-[47px] grid-cols-1 items-center gap-2 border-b border-[#e7e9f1] py-1 sm:grid-cols-[1fr_1.05fr]">
      <span className={label}>
        {title}
        {info && (
          <span
            title="Additional information"
            className="ml-2 inline-flex h-[17px] w-[17px] items-center justify-center rounded-full border border-slate-400 text-[11px] text-slate-500"
          >
            i
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-[17px] border border-[#e1e5f0] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(25,35,80,.045)]"
    >
      <div className="mb-2 border-b border-[#e7e9f1] pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#101638]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[#647092]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function SettingsNav() {
  const items = [
    ["cv", "▤", "CV Preferences"],
    ["jobs", "▱", "Job Preferences"],
    ["notifications", "♧", "Notifications"],
    ["account", "⬡", "Account & Security"],
  ];

  return (
    <nav className="h-fit rounded-2xl border border-[#e1e5f0] bg-white p-3 shadow-sm lg:sticky lg:top-5">
      {items.map(([id, icon, name], i) => (
        <a
          key={id}
          href={`#${id}`}
          className={`flex min-h-[56px] items-center gap-4 px-4 text-[15px] font-medium ${
            i === 0
              ? "rounded-[10px] border border-[#8a4cff] bg-[#f2eaff] text-[#6422e9]"
              : "border-b border-[#e8eaf2] text-[#17203f] hover:bg-[#f8f6ff]"
          }`}
        >
          <span className="w-6 text-center text-[23px]">
            {icon}
          </span>
          {name}
        </a>
      ))}
    </nav>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error(
            (await response.text()) || "Could not load settings."
          );
        }

        const data = await response.json();

        if (active) {
          setSettings({
            ...defaults,
            ...(data.settings ?? data),
          });
        }
      } catch (e) {
        if (active) {
          setError(
            e instanceof Error
              ? e.message
              : "Could not load settings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((old) => ({
      ...old,
      [key]: value,
    }));

    setMessage("");
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not save settings."
        );
      }

      setSettings({
        ...defaults,
        ...(data.settings ?? data),
      });

      setMessage("Settings saved successfully.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateList(
    key:
      | "preferred_job_titles"
      | "preferred_locations"
      | "employment_types"
      | "work_modes",
    value: string
  ) {
    update(
      key,
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fc] text-[#111936]">
      <DashboardSidebar />

      <main className="ml-64 min-h-screen">
        <DashboardHeader
          title="Settings"
          subtitle="Manage your CareerPilot preferences"
        />

        <div className="mx-auto max-w-[1500px] p-5 md:p-7">
          {loading && (
            <p className="mb-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
              Loading settings…
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <SettingsNav />

            <div className="min-w-0 space-y-5">
              <Section
                id="cv"
                title="CV Preferences"
                description="Set your default CV tailoring preferences."
              >
                <Row title="Preferred CV Length">
                  <select
                    className={field}
                    value={settings.preferred_cv_length}
                    onChange={(e) =>
                      update("preferred_cv_length", e.target.value)
                    }
                  >
                    <option>1-2 pages</option>
                    <option>2-3 pages</option>
                    <option>3+ pages</option>
                  </select>
                </Row>

                <Row title="Preferred CV Format">
                  <select
                    className={field}
                    value={settings.preferred_cv_format}
                    onChange={(e) =>
                      update("preferred_cv_format", e.target.value)
                    }
                  >
                    <option>PDF</option>
                    <option>DOCX</option>
                  </select>
                </Row>

                <Toggle
                  labelText="Include Professional Summary"
                  checked={settings.include_professional_summary}
                  onChange={(v) =>
                    update("include_professional_summary", v)
                  }
                />

                <Toggle
                  labelText="Include Certifications"
                  checked={settings.include_certifications}
                  onChange={(v) =>
                    update("include_certifications", v)
                  }
                />

                <Row title="Use UK or US English">
                  <select
                    className={field}
                    value={settings.language_variant}
                    onChange={(e) =>
                      update("language_variant", e.target.value)
                    }
                  >
                    <option>UK English</option>
                    <option>US English</option>
                  </select>
                </Row>

                <Toggle
                  labelText="Preserve Original Employment Dates"
                  info
                  checked={settings.preserve_employment_dates}
                  onChange={(v) =>
                    update("preserve_employment_dates", v)
                  }
                />
              </Section>

              <Section
                id="jobs"
                title="Job Preferences"
                description="Control which opportunities CareerPilot recommends."
              >
                <div className="space-y-4 py-2">
                  <label className="block">
                    <span className={label}>Preferred Job Titles</span>
                    <input
                      className={`${field} mt-2`}
                      value={settings.preferred_job_titles.join(", ")}
                      onChange={(e) =>
                        updateList(
                          "preferred_job_titles",
                          e.target.value
                        )
                      }
                      placeholder="Data Scientist, ML Engineer, Data Analyst"
                    />
                  </label>

                  <label className="block">
                    <span className={label}>Preferred Locations</span>
                    <input
                      className={`${field} mt-2`}
                      value={settings.preferred_locations.join(", ")}
                      onChange={(e) =>
                        updateList(
                          "preferred_locations",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>Employment Types</span>
                      <input
                        className={`${field} mt-2`}
                        value={settings.employment_types.join(", ")}
                        onChange={(e) =>
                          updateList(
                            "employment_types",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label className="block">
                      <span className={label}>Work Modes</span>
                      <input
                        className={`${field} mt-2`}
                        value={settings.work_modes.join(", ")}
                        onChange={(e) =>
                          updateList("work_modes", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={label}>Minimum Salary</span>
                      <input
                        className={`${field} mt-2`}
                        type="number"
                        value={settings.salary_min ?? ""}
                        onChange={(e) =>
                          update(
                            "salary_min",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </label>

                    <label className="block">
                      <span className={label}>Maximum Salary</span>
                      <input
                        className={`${field} mt-2`}
                        type="number"
                        value={settings.salary_max ?? ""}
                        onChange={(e) =>
                          update(
                            "salary_max",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </Section>

              <Section
                id="notifications"
                title="Notifications"
                description="Choose which updates CareerPilot should send you."
              >
                <Toggle
                  labelText="New matching jobs"
                  checked={settings.notify_new_jobs}
                  onChange={(v) => update("notify_new_jobs", v)}
                />

                <Toggle
                  labelText="CV tailoring completed"
                  checked={settings.notify_tailoring_complete}
                  onChange={(v) =>
                    update("notify_tailoring_complete", v)
                  }
                />

                <Toggle
                  labelText="CV generation failed"
                  checked={settings.notify_tailoring_failed}
                  onChange={(v) =>
                    update("notify_tailoring_failed", v)
                  }
                />

                <Toggle
                  labelText="Application reminders"
                  checked={settings.notify_application_reminders}
                  onChange={(v) =>
                    update("notify_application_reminders", v)
                  }
                />
              </Section>

              <Section
                id="account"
                title="Account & Security"
                description="Manage your account security preferences."
              >
                <p className="py-2 text-sm text-[#647092]">
                  Account and security controls can be connected here.
                </p>
              </Section>

              <div className="sticky bottom-4 z-10 flex min-h-[72px] flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#e1e5f0] bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
                <div className="text-sm" aria-live="polite">
                  {message && (
                    <span className="text-green-700">{message}</span>
                  )}
                  {error && (
                    <span className="text-red-600">{error}</span>
                  )}
                </div>

                <button
                  onClick={saveSettings}
                  disabled={saving || loading}
                  className="rounded-[10px] bg-[#7028f4] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1ed8] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}