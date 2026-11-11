
"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Experience = {
  employer?: string;
  title?: string;
  dates?: string;
  location?: string;
  bullets?: string[];
};

type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
};

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasCV, setHasCV] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cv/current`);

        if (response.status === 404) {
          setError("Upload your Master CV first to populate your profile.");
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load your saved Master CV.");
        }

        const data = await response.json();
        const cv = data.master_cv ?? {};

        setProfile((previous) => ({
          ...previous,
          name: cv.name ?? "",
          email: cv.email ?? "",
          phone: cv.phone ?? "",
          location: cv.location ?? "",
        }));

        setSkills(Array.isArray(cv.skills) ? cv.skills : []);
        setExperience(
          Array.isArray(cv.experience) ? cv.experience : []
        );
        setEducation(
          Array.isArray(cv.education) ? cv.education : []
        );
        setCertifications(
          Array.isArray(cv.certifications) ? cv.certifications : []
        );

        setHasCV(true);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load your profile. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const completedSections = [
    Boolean(profile.name || profile.email || profile.phone || profile.location),
    experience.length > 0,
    skills.length > 0,
    Array.isArray(
      (profile as Profile & { languages?: string[] }).languages
    ) &&
      Boolean(
        (profile as Profile & { languages?: string[] }).languages?.length
      ),
    Boolean(education.length),
  ];

  const profileScore = Math.round(
    (completedSections.filter(Boolean).length / completedSections.length) *
      100
  );

  function updateProfile(field: keyof Profile, value: string) {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    // This currently updates the UI only. A profile-save endpoint
    // is needed to persist edits and preferences in the backend.
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#f1f5fb] text-slate-900">
      <DashboardSidebar />

      <main className="ml-64 min-h-screen">
        <DashboardHeader
          title="My Profile"
          subtitle="Keep your career information up to date"
          actionLabel={saved ? "Saved" : "Save Changes"}
          onAction={handleSave}
        />

        <div className="px-7 py-6">
          {loading && (
            <p className="mb-4 text-sm text-slate-500">
              Loading your saved profile...
            </p>
          )}

          {error && (
            <div
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
              role="status"
            >
              {error}
            </div>
          )}

          {hasCV && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Your profile information was loaded from your saved Master CV.
              You can edit the fields below.
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-5">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">
                    👤 Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={profile.name}
                    onChange={(value) => updateProfile("name", value)}
                  />

                  <Field
                    label="Email Address"
                    value={profile.email}
                    onChange={(value) => updateProfile("email", value)}
                  />

                  <Field
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(value) => updateProfile("phone", value)}
                  />

                  <Field
                    label="Location"
                    value={profile.location}
                    onChange={(value) => updateProfile("location", value)}
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="LinkedIn Profile"
                      value={profile.linkedin}
                      onChange={(value) => updateProfile("linkedin", value)}
                      placeholder="Add your LinkedIn URL"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">🧠 Skills</h2>
                </div>

                <div className="p-6">
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyMessage>
                      No skills were extracted from your Master CV yet.
                    </EmptyMessage>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">💼 Work History</h2>
                </div>

                <div className="space-y-5 p-6">
                  {experience.length > 0 ? (
                    experience.map((job, index) => (
                      <div
                        key={`${job.employer ?? "job"}-${index}`}
                        className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                      >
                        <h3 className="font-semibold">
                          {job.title || "Position not specified"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {[job.employer, job.location, job.dates]
                            .filter(Boolean)
                            .join(" · ") || "No additional details"}
                        </p>

                        {job.bullets && job.bullets.length > 0 && (
                          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            {job.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : (
                    <EmptyMessage>
                      No work history was extracted from your Master CV yet.
                    </EmptyMessage>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">🎓 Education</h2>
                </div>

                <div className="p-6">
                  {education.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {education.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyMessage>
                      No education details were extracted yet.
                    </EmptyMessage>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">📜 Certifications</h2>
                </div>

                <div className="p-6">
                  {certifications.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {certifications.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyMessage>
                      No certifications were extracted yet.
                    </EmptyMessage>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">🎯 Career Preferences</h2>
                </div>

                <div className="space-y-7 p-6">
                  <EmptyMessage>
                    Your job titles, preferred locations, and employment
                    preferences will be saved separately from your Master CV.
                    These preferences are not yet connected to backend storage.
                  </EmptyMessage>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
                  Profile Score
                </p>

                <div className="mx-auto my-6 flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-indigo-500">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">
                      {profileScore}
                    </div>
                    <div className="text-[10px] text-slate-400">/ 100</div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <ScoreRow
                    label="Personal Info"
                    complete={completedSections[0]}
                  />
                  <ScoreRow
                    label="Work History"
                    complete={completedSections[1]}
                  />
                  <ScoreRow
                    label="Skills"
                    complete={completedSections[2]}
                  />
                  <ScoreRow
                    label="Languages"
                    complete={completedSections[3]}
                  />
                  <ScoreRow
                    label="Education"
                    complete={completedSections[4]}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="font-semibold">🔔 Job Alerts</h2>
                </div>

                <div className="space-y-5 p-6">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Enable job alerts</span>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={alerts}
                      onClick={() => setAlerts((value) => !value)}
                      className={`relative h-7 w-12 rounded-full transition ${
                        alerts ? "bg-[#5b50e8]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                          alerts ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </label>

                  <div className="border-t border-slate-100 pt-5">
                    <p className="mb-3 text-sm font-medium text-slate-500">
                      Alert frequency
                    </p>
                    <p className="text-sm text-slate-400">
                      Alert preferences will be connected to backend storage
                      in the next step.
                    </p>
                  </div>
                </div>
              </section>

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-xl bg-[#5b50e8] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4d43dc]"
              >
                {saved ? "✓ Changes Saved" : "▣ Save All Changes"}
              </button>

              {saved && (
                <p className="text-center text-xs text-amber-700">
                  This is a temporary UI confirmation. Profile edits are not
                  persisted by the backend yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-500">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
      />
    </label>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-400">{children}</p>;
}

function ScoreRow({
  label,
  complete = false,
}: {
  label: string;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          complete
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {complete ? "✓" : ""}
      </span>

      <span className={complete ? "text-slate-700" : "text-slate-400"}>
        {label}
      </span>
    </div>
  );
}
