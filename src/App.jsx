import React, { useEffect, useMemo, useState } from "react";

function toGoogleDriveEmbed(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  const fileId = match ? match[1] : "";
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function toGoogleDriveImage(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  const fileId = match ? match[1] : "";
  if (!fileId) return url;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

const ADMIN_PASSWORD = "change-me-123";

const defaultSiteData = {
  profile: {
    name: "Dmitriy",
    title: "AI Creator | AI Video Creator | Generative Media Producer",
    subtitle:
      "I create story-driven AI videos, original characters, and short-form cinematic concepts — from idea and scripting to generation, consistency, and final edit.",
    email: "dmitriyspbs@gmail.com",
    telegram: "@dmitriyspbs",
    location: "Russia • Remote worldwide • Open to relocation",
    heroImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { value: "5–7", label: "YouTube Shorts per 8-hour day" },
      { value: "2025–", label: "AI Creator at TSP Group" },
      { value: "Remote", label: "Open to international work" },
    ],
  },
  tools: [
    "GPT",
    "Grok",
    "Kling",
    "Sora",
    "Suno",
    "HeyGen",
    "ComfyUI",
    "Gemini",
    "Claude",
    "Kdenlive",
    "Sony Vegas",
    "CapCut",
  ],
  sections: {
    showStats: true,
    showTools: true,
    showContact: true,
  },
  projects: [
    {
      slug: "project-1",
      title: "Project 1",
      category: "Character-Based AI Format",
      shortDescription: "Replace this text with your short project description.",
      fullDescription:
        "Replace this text with a longer project description. Here you can explain what the project is, what makes it strong, and what the viewer should open first.",
      coverImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ],
      videos: [
        {
          label: "Video 1",
          url: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
        },
      ],
    },
    {
      slug: "project-2",
      title: "Project 2",
      category: "Short-Form AI Comedy",
      shortDescription: "Replace this text with your short project description.",
      fullDescription:
        "Add your full project text here. You can explain the concept, task, style, and what kind of content this project represents.",
      coverImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      ],
      videos: [
        {
          label: "Video 1",
          url: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
        },
      ],
    },
  ],
};

function useStoredSiteData() {
  const [siteData, setSiteData] = useState(() => {
    if (typeof window === "undefined") return defaultSiteData;
    const saved = window.localStorage.getItem("ai-creator-site-data");
    return saved ? JSON.parse(saved) : defaultSiteData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ai-creator-site-data", JSON.stringify(siteData));
    }
  }, [siteData]);

  return [siteData, setSiteData];
}

function useHashRoute() {
  const getRoute = () => {
    if (typeof window === "undefined") return { type: "home", slug: "" };
    const hash = window.location.hash;

    if (hash === "#/admin") return { type: "admin", slug: "" };
    if (hash.startsWith("#/project/")) {
      return { type: "project", slug: hash.replace("#/project/", "") };
    }

    return { type: "home", slug: "" };
  };

  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

function Field({ label, value, onChange, textarea = false }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/40">{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
        />
      )}
    </label>
  );
}

function SmallField({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/40">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
      />
    </label>
  );
}

function SectionCard({ title, children, right }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-lg font-medium text-white">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatsEditor({ stats, onChange }) {
  const updateStat = (index, key, value) => {
    const next = [...stats];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <SmallField label="Value" value={stat.value} onChange={(v) => updateStat(index, "value", v)} />
          <div className="mt-3">
            <SmallField label="Label" value={stat.label} onChange={(v) => updateStat(index, "label", v)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsEditor({ tools, onChange }) {
  const [draft, setDraft] = useState("");

  const removeTool = (tool) => onChange(tools.filter((item) => item !== tool));
  const addTool = () => {
    if (!draft.trim()) return;
    onChange([...tools, draft.trim()]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => removeTool(tool)}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/75"
          >
            {tool} ×
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add tool"
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
        />
        <button onClick={addTool} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black">
          Add
        </button>
      </div>
    </div>
  );
}

function GalleryEditor({ images, onChange }) {
  const updateImage = (index, value) => {
    const next = [...images];
    next[index] = value;
    onChange(next);
  };

  const addImage = () => onChange([...images, "https://"]);
  const removeImage = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {images.map((img, index) => (
        <div key={index} className="flex gap-3">
          <input
            value={img}
            onChange={(e) => updateImage(index, e.target.value)}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
          />
          <button onClick={() => removeImage(index)} className="rounded-xl border border-white/10 px-3 text-sm text-white/70">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addImage} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
        + Add image
      </button>
    </div>
  );
}

function VideosEditor({ videos, onChange }) {
  const updateVideo = (index, key, value) => {
    const next = [...videos];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const addVideo = () =>
    onChange([...videos, { label: "Video", url: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing" }]);

  const removeVideo = (index) => onChange(videos.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {videos.map((video, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[0.3fr_0.7fr_auto]">
          <input
            value={video.label}
            onChange={(e) => updateVideo(index, "label", e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
          />
          <input
            value={video.url}
            onChange={(e) => updateVideo(index, "url", e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white outline-none"
          />
          <button onClick={() => removeVideo(index)} className="rounded-xl border border-white/10 px-3 text-sm text-white/70">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addVideo} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
        + Add video
      </button>
    </div>
  );
}

function ProjectEditor({ project, onChange, onRemove }) {
  const update = (key, value) => onChange({ ...project, [key]: value });

  return (
    <SectionCard
      title={project.title || "New project"}
      right={
        <button onClick={onRemove} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          Delete
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug" value={project.slug} onChange={(v) => update("slug", v)} />
        <Field label="Category" value={project.category} onChange={(v) => update("category", v)} />
        <Field label="Title" value={project.title} onChange={(v) => update("title", v)} />
        <Field label="Cover image URL" value={project.coverImage} onChange={(v) => update("coverImage", v)} />
      </div>
      <div className="mt-4 grid gap-4">
        <Field label="Short description" value={project.shortDescription} onChange={(v) => update("shortDescription", v)} textarea />
        <Field label="Full description" value={project.fullDescription} onChange={(v) => update("fullDescription", v)} textarea />
      </div>
      <div className="mt-6">
        <div className="mb-3 text-sm font-medium text-white">Gallery</div>
        <GalleryEditor images={project.gallery} onChange={(v) => update("gallery", v)} />
      </div>
      <div className="mt-6">
        <div className="mb-3 text-sm font-medium text-white">Videos</div>
        <VideosEditor videos={project.videos} onChange={(v) => update("videos", v)} />
      </div>
    </SectionCard>
  );
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
          <div className="text-sm uppercase tracking-[0.2em] text-white/35">Admin</div>
          <h1 className="mt-3 text-3xl font-semibold">Site admin panel</h1>
          <p className="mt-4 text-white/60 leading-8">
            Enter your password to edit the website content. Public visitors will not see this panel unless they open{" "}
            <span className="text-white">#/admin</span>.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none"
            />
            {error ? <div className="text-sm text-red-300">{error}</div> : null}
            <button type="submit" className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">
              Enter admin panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ siteData, setSiteData, onLogout }) {
  const updateProfile = (key, value) => {
    setSiteData({ ...siteData, profile: { ...siteData.profile, [key]: value } });
  };

  const updateSections = (key, value) => {
    setSiteData({ ...siteData, sections: { ...siteData.sections, [key]: value } });
  };

  const updateProject = (index, nextProject) => {
    const next = [...siteData.projects];
    next[index] = nextProject;
    setSiteData({ ...siteData, projects: next });
  };

  const addProject = () => {
    setSiteData({
      ...siteData,
      projects: [
        ...siteData.projects,
        {
          slug: `project-${siteData.projects.length + 1}`,
          title: `Project ${siteData.projects.length + 1}`,
          category: "New Category",
          shortDescription: "Short description",
          fullDescription: "Full description",
          coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          gallery: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"],
          videos: [{ label: "Video 1", url: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing" }],
        },
      ],
    });
  };

  const removeProject = (index) => {
    setSiteData({ ...siteData, projects: siteData.projects.filter((_, i) => i !== index) });
  };

  const resetAll = () => {
    if (window.confirm("Reset all site content to defaults?")) {
      setSiteData(defaultSiteData);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/35">Admin panel</div>
            <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Edit your portfolio site</h1>
            <p className="mt-4 max-w-3xl text-white/60 leading-8">
              This is a browser-based admin panel. It is convenient for editing content, but it is not a secure server-side CMS.
              Before publishing, change the admin password in the code.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={resetAll} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
              Reset content
            </button>
            <button onClick={onLogout} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black">
              Log out
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={siteData.profile.name} onChange={(v) => updateProfile("name", v)} />
              <Field label="Title" value={siteData.profile.title} onChange={(v) => updateProfile("title", v)} />
              <Field label="Email" value={siteData.profile.email} onChange={(v) => updateProfile("email", v)} />
              <Field label="Telegram" value={siteData.profile.telegram} onChange={(v) => updateProfile("telegram", v)} />
              <Field label="Location" value={siteData.profile.location} onChange={(v) => updateProfile("location", v)} />
              <Field label="Hero image URL" value={siteData.profile.heroImage} onChange={(v) => updateProfile("heroImage", v)} />
            </div>
            <div className="mt-4">
              <Field label="Subtitle" value={siteData.profile.subtitle} onChange={(v) => updateProfile("subtitle", v)} textarea />
            </div>
            <div className="mt-6">
              <div className="mb-3 text-sm font-medium text-white">Stats</div>
              <StatsEditor
                stats={siteData.profile.stats}
                onChange={(next) => setSiteData({ ...siteData, profile: { ...siteData.profile, stats: next } })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Sections visibility">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["showStats", "Show stats"],
                ["showTools", "Show tools"],
                ["showContact", "Show contact"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <input
                    type="checkbox"
                    checked={siteData.sections[key]}
                    onChange={(e) => updateSections(key, e.target.checked)}
                  />
                  <span className="text-sm text-white/75">{label}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tools">
            <ToolsEditor tools={siteData.tools} onChange={(next) => setSiteData({ ...siteData, tools: next })} />
          </SectionCard>

          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-lg font-medium text-white">Projects</div>
              <button onClick={addProject} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black">
                + Add project
              </button>
            </div>
            <div className="space-y-4">
              {siteData.projects.map((project, index) => (
                <ProjectEditor
                  key={project.slug + index}
                  project={project}
                  onChange={(next) => updateProject(index, next)}
                  onRemove={() => removeProject(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPage({ project }) {
  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <a href="#/" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 hover:bg-white/[0.06]">
          ← Back to main page
        </a>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
              {project.category}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{project.fullDescription}</p>

            <div className="mt-8 grid gap-6">
              {project.videos.map((video, i) => (
                <div key={video.url + i} className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-3">
                  <div className="mb-3 text-sm text-white/70">{video.label}</div>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    <iframe
                      src={toGoogleDriveEmbed(video.url)}
                      className="aspect-video w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={`${project.title} video ${i + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
              <img src={toGoogleDriveImage(project.coverImage)} alt={project.title} className="aspect-[4/5] h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <div key={img + idx} className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/[0.04]">
                  <img src={toGoogleDriveImage(img)} alt={`${project.title} ${idx + 1}`} className="aspect-[4/3] h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ siteData }) {
  return (
    <div className="min-h-screen bg-[#07090d] text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[40rem] w-[40rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[38rem] w-[38rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-white/75 backdrop-blur-xl">
                {siteData.profile.name} • AI Creator Portfolio
              </div>
              <h1 className="max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.02]">
                {siteData.profile.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
                {siteData.profile.subtitle}
              </p>

              {siteData.sections.showStats ? (
                <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
                  {siteData.profile.stats.map((stat, index) => (
                    <div key={index} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                      <div className="text-2xl font-semibold">{stat.value}</div>
                      <div className="mt-1 text-sm text-white/55">{stat.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-fuchsia-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl">
                <div className="aspect-[4/5] overflow-hidden bg-black/20">
                  <img src={toGoogleDriveImage(siteData.profile.heroImage)} alt="Hero" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/35">Selected Work</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Projects</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {siteData.projects.map((project, index) => (
              <a
                key={project.slug + index}
                href={`#/project/${project.slug}`}
                className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-black/20">
                  <img src={toGoogleDriveImage(project.coverImage)} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/80 backdrop-blur">
                    {project.category}
                  </div>
                  <div className="absolute right-4 top-4 text-sm text-white/45">0{index + 1}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-medium leading-tight">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60 line-clamp-3">{project.shortDescription}</p>
                  <div className="mt-6 flex items-center justify-between text-sm text-white/45">
                    <span>Open project page</span>
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {siteData.sections.showTools ? (
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/35">Tools</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-5xl">AI tools and editing stack</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {siteData.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {siteData.sections.showContact ? (
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/35">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Open to remote work, creative collaborations, and international teams.</h2>
              </div>
              <div className="flex flex-col gap-4 lg:items-end">
                <a href={`mailto:${siteData.profile.email}`} className="rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02]">
                  {siteData.profile.email}
                </a>
                <div className="text-sm text-white/40">Telegram: {siteData.profile.telegram}</div>
                <div className="text-sm text-white/40">{siteData.profile.location}</div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function ModernAICreatorLanding() {
  const [siteData, setSiteData] = useStoredSiteData();
  const [isAdmin, setIsAdmin] = useState(false);
  const route = useHashRoute();
  const project = useMemo(
    () => siteData.projects.find((item) => item.slug === route.slug),
    [route.slug, siteData.projects]
  );

  if (route.type === "admin") {
    return isAdmin ? (
      <AdminPanel siteData={siteData} setSiteData={setSiteData} onLogout={() => setIsAdmin(false)} />
    ) : (
      <AdminLogin onLogin={setIsAdmin} />
    );
  }

  if (route.type === "project" && project) {
    return <ProjectPage project={project} />;
  }

  return <HomePage siteData={siteData} />;
}