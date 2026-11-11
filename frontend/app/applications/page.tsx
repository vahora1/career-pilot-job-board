"use client";

import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";

type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

type Application = {
  id: number;
  title: string;
  company: string;
  initials: string;
  match: number;
  appliedDate: string;
  nextStep: string;
  status: ApplicationStatus;
  tailoredCV: boolean;
  accent: string;
};

const initialApplications: Application[] = [
  {
    id: 1,
    title: "Data Scientist",
    company: "ABC Technologies",
    initials: "AT",
    match: 89,
    appliedDate: "Applied Sep 10, 2026",
    nextStep: "Interview on Sep 18, 2026",
    status: "Interview",
    tailoredCV: true,
    accent: "bg-indigo-600",
  },
  {
    id: 2,
    title: "ML Engineer",
    company: "XYZ Technologies",
    initials: "XT",
    match: 84,
    appliedDate: "Applied Sep 8, 2026",
    nextStep: "Waiting for response",
    status: "Applied",
    tailoredCV: true,
    accent: "bg-purple-600",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DEF Consulting",
    initials: "DC",
    match: 81,
    appliedDate: "Applied Sep 5, 2026",
    nextStep: "Call on Sep 16, 2026",
    status: "Screening",
    tailoredCV: true,
    accent: "bg-cyan-600",
  },
  {
    id: 4,
    title: "Senior Data Scientist",
    company: "Noon",
    initials: "NO",
    match: 78,
    appliedDate: "Applied Aug 28, 2026",
    nextStep: "",
    status: "Rejected",
    tailoredCV: false,
    accent: "bg-orange-600",
  },
];

const statusOrder: ApplicationStatus[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
];

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [activeTab, setActiveTab] = useState<
    "All" | ApplicationStatus
  >("All");

  const filteredApplications =
    activeTab === "All"
      ? applications
      : applications.filter((application) => {
          if (activeTab === "Offer") {
            return application.status === "Offer";
          }

          return application.status === activeTab;
        });

  const totalApplied = applications.length;

  const inProgress = applications.filter(
    (application) =>
      application.status === "Applied" ||
      application.status === "Screening" ||
      application.status === "Interview"
  ).length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const responseRate = 75;

  const tailoredCVs = applications.filter(
    (application) => application.tailoredCV
  ).length;

  function updateStatus(
    id: number,
    status: ApplicationStatus
  ) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? {
              ...application,
              status,
              nextStep: getNextStep(status),
            }
          : application
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f9] text-slate-900">
      <DashboardSidebar />

      <main className="ml-64 min-h-screen">
        <DashboardHeader
          title="Applications"
          subtitle="Track your job applications and interview pipeline"
        />

        <div className="px-7 py-6">
          {/* STAT CARDS */}
          <div className="grid grid-cols-5 gap-3">
            <StatCard
              icon="📋"
              value={totalApplied}
              label="Total Applied"
              iconBg="bg-indigo-50"
              valueColor="text-indigo-600"
            />

            <StatCard
              icon="⌛"
              value={inProgress}
              label="In Progress"
              iconBg="bg-amber-50"
              valueColor="text-amber-600"
            />

            <StatCard
              icon="🎤"
              value={interviews}
              label="Interviews"
              iconBg="bg-emerald-50"
              valueColor="text-emerald-600"
            />

            <StatCard
              icon="📈"
              value={`${responseRate}%`}
              label="Response Rate"
              iconBg="bg-purple-50"
              valueColor="text-purple-600"
            />

            <StatCard
              icon="✦"
              value={tailoredCVs}
              label="Tailored CVs"
              iconBg="bg-sky-50"
              valueColor="text-sky-600"
            />
          </div>

          {/* FILTER TABS */}
          <div className="mt-5">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <TabButton
                active={activeTab === "All"}
                onClick={() => setActiveTab("All")}
                label="All"
                count={applications.length}
              />

              <TabButton
                active={activeTab === "Applied"}
                onClick={() => setActiveTab("Applied")}
                label="Applied"
                count={
                  applications.filter(
                    (application) =>
                      application.status === "Applied"
                  ).length
                }
              />

              <TabButton
                active={activeTab === "Screening"}
                onClick={() => setActiveTab("Screening")}
                label="Screening"
                count={
                  applications.filter(
                    (application) =>
                      application.status === "Screening"
                  ).length
                }
              />

              <TabButton
                active={activeTab === "Interview"}
                onClick={() => setActiveTab("Interview")}
                label="Interview"
                count={
                  applications.filter(
                    (application) =>
                      application.status === "Interview"
                  ).length
                }
              />

              <TabButton
                active={activeTab === "Offer"}
                onClick={() => setActiveTab("Offer")}
                label="Offer"
              />

              <TabButton
                active={activeTab === "Rejected"}
                onClick={() => setActiveTab("Rejected")}
                label="Rejected"
                count={
                  applications.filter(
                    (application) =>
                      application.status === "Rejected"
                  ).length
                }
              />
            </div>
          </div>

          {/* APPLICATION LIST */}
          <div className="mt-5 space-y-3">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onStatusChange={updateStatus}
              />
            ))}

            {filteredApplications.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="text-3xl">📂</div>

                <h3 className="mt-3 text-base font-semibold text-slate-700">
                  No applications here
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Applications with this status will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------
   APPLICATION CARD
------------------------------------------------------- */

function ApplicationCard({
  application,
  onStatusChange,
}: {
  application: Application;
  onStatusChange: (
    id: number,
    status: ApplicationStatus
  ) => void;
}) {
  const currentStep = getCurrentStep(application.status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center gap-5">
        {/* COMPANY ICON */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-sm ${application.accent}`}
        >
          {application.initials}
        </div>

        {/* JOB INFORMATION */}
        <div className="min-w-[360px] flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">
              {application.title}
            </h3>

            <MatchBadge score={application.match} />

            {application.tailoredCV && (
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                ✦ Tailored CV
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {application.company}
          </p>

          <div className="mt-1.5 flex items-center gap-3 text-xs">
            <span className="text-slate-400">
              {application.appliedDate}
            </span>

            {application.nextStep && (
              <>
                <span className="text-slate-300">|</span>

                <span
                  className={
                    application.status === "Interview"
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }
                >
                  {application.nextStep}
                </span>
              </>
            )}
          </div>
        </div>

        {/* PIPELINE */}
        <div className="hidden min-w-[430px] items-center lg:flex">
          <Pipeline
            status={application.status}
            currentStep={currentStep}
          />
        </div>

        {/* STATUS DROPDOWN */}
        <div className="relative">
          <select
            value={application.status}
            onChange={(event) =>
              onStatusChange(
                application.id,
                event.target.value as ApplicationStatus
              )
            }
            className={`appearance-none rounded-full border px-4 py-2 pr-8 text-xs font-medium outline-none ${getStatusClasses(
              application.status
            )}`}
          >
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">
            ⌄
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PIPELINE
------------------------------------------------------- */

function Pipeline({
  status,
  currentStep,
}: {
  status: ApplicationStatus;
  currentStep: number;
}) {
  const steps = [
    "Applied",
    "Screening",
    "Interview",
    "Offer",
  ];

  if (status === "Rejected") {
    return (
      <div className="flex w-full items-center justify-end gap-2">
        {steps.map((step) => (
          <div
            key={step}
            className="flex flex-col items-center"
          >
            <div className="h-3 w-3 rounded-full bg-slate-200" />

            <span className="mt-1.5 text-[10px] text-slate-400">
              {step}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full items-start">
      {steps.map((step, index) => {
        const completed = index <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step}
            className="flex flex-1 items-start"
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  completed
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-white"
                }`}
              >
                {completed ? "✓" : ""}
              </div>

              <span
                className={`mt-1.5 whitespace-nowrap text-[10px] ${
                  completed
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mt-3 h-0.5 flex-1 ${
                  index < currentStep
                    ? "bg-indigo-600"
                    : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------
   STAT CARD
------------------------------------------------------- */

function StatCard({
  icon,
  value,
  label,
  iconBg,
  valueColor,
}: {
  icon: string;
  value: number | string;
  label: string;
  iconBg: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${iconBg}`}
      >
        {icon}
      </div>

      <div>
        <div className={`text-xl font-medium ${valueColor}`}>
          {value}
        </div>

        <div className="mt-0.5 text-xs text-slate-500">
          {label}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   TAB BUTTON
------------------------------------------------------- */

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm transition ${
        active
          ? "bg-[#5b50e8] text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      {label}

      {count !== undefined && (
        <span className="ml-1">
          ({count})
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------
   MATCH BADGE
------------------------------------------------------- */

function MatchBadge({
  score,
}: {
  score: number;
}) {
  const classes =
    score >= 85
      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
      : score >= 80
      ? "border-amber-200 bg-amber-50 text-amber-600"
      : "border-amber-200 bg-amber-50 text-amber-600";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      <span className="mr-1">●</span>
      {score}% Match
    </span>
  );
}

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function getCurrentStep(status: ApplicationStatus) {
  if (status === "Applied") return 0;
  if (status === "Screening") return 1;
  if (status === "Interview") return 2;
  if (status === "Offer") return 3;

  return -1;
}

function getNextStep(status: ApplicationStatus) {
  if (status === "Applied") {
    return "Waiting for response";
  }

  if (status === "Screening") {
    return "Screening in progress";
  }

  if (status === "Interview") {
    return "Interview scheduled";
  }

  if (status === "Offer") {
    return "Offer received";
  }

  return "";
}

function getStatusClasses(status: ApplicationStatus) {
  if (status === "Interview") {
    return "border-indigo-200 bg-indigo-50 text-indigo-600";
  }

  if (status === "Screening") {
    return "border-amber-200 bg-amber-50 text-amber-600";
  }

  if (status === "Offer") {
    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  }

  if (status === "Rejected") {
    return "border-slate-200 bg-slate-100 text-slate-500";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-600";
}