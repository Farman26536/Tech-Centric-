import { ArrowRight, BarChart3, CheckCircle2, Clock3, FolderKanban, Layers3, ListTodo, Lock, MessageSquareText, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/features/ThemeToggle';

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Workflow', href: '#workflow' }
];

const featureCards = [
  { icon: Layers3, title: 'Unified workspace', text: 'Keep projects, tasks, and updates together in one clean operating system for your team.' },
  { icon: ListTodo, title: 'Smart planning', text: 'Prioritize work with clear task flow, progress tracking, and shared accountability.' },
  { icon: BarChart3, title: 'Real-time analytics', text: 'See workloads, delivery speed, and team health from a single dashboard.' },
  { icon: MessageSquareText, title: 'Team collaboration', text: 'Discuss work, assign action items, and keep every stakeholder aligned.' },
  { icon: Lock, title: 'Secure access', text: 'Protect every workload with authenticated access and role-aware project visibility.' },
  { icon: Zap, title: 'Faster delivery', text: 'Reduce handoff friction so projects move from backlog to completion with less drag.' }
];

const workflowSteps = [
  'Connect your projects, milestones, and owners.',
  'Assign tasks with clear visibility and delivery dates.',
  'Monitor workload and unblock issues faster.',
  'Ship with confidence using live team insights.'
];

const metrics = [
  { value: '2.4x', label: 'faster execution' },
  { value: '87%', label: 'team visibility' },
  { value: '4.9/5', label: 'team satisfaction' }
];

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen transition-colors">
      <header className="landing-header sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="TeamFlow home">
            <div className="text-lg font-semibold tracking-tight">
              <span className="text-indigo-500">T</span>eamFlow
            </div>
          </Link>

          <nav className="landing-nav hidden items-center gap-8 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="landing-link hidden rounded-lg px-4 py-2 text-sm font-medium transition sm:inline-flex">
              Sign In
            </Link>
            <Link to="/register" className="landing-cta inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl">
              <div className="landing-badge mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles className="h-3.5 w-3.5" />
                Built for modern teams
              </div>
              <h1 className="landing-title text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Run projects with <span className="accent-word">clarity</span> and <span className="accent-word">speed.</span>
              </h1>
              <p className="landing-subtitle mt-6 text-lg leading-8">
                TeamFlow gives teams a single source of truth for planning, execution, and accountability across every project.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="landing-cta inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="landing-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition hover:-translate-y-0.5">
                  Sign In
                </Link>
              </div>

              <div className="landing-proof mt-8 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Setup in minutes
                </div>
              </div>
            </div>

            <div id="product" className="relative">
              <div className="landing-hero-glow absolute -inset-4 rounded-[30px]" />
              <div className="landing-mockup relative overflow-hidden rounded-[28px] p-4">
                <div className="landing-mockup-panel rounded-2xl p-4">
                  <div className="landing-panel-header flex items-center justify-between pb-4">
                    <div>
                      <div className="landing-label text-xs font-medium uppercase tracking-[0.2em]">Overview</div>
                      <div className="landing-panel-title mt-1 text-lg font-semibold">Project dashboard</div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                      On track
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="landing-metric-card rounded-2xl p-3">
                        <div className="landing-metric-value text-xl font-bold">{metric.value}</div>
                        <div className="landing-label mt-1 text-xs">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="landing-project-card rounded-2xl p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="landing-project-title text-sm font-semibold">Website redesign</div>
                            <div className="landing-label mt-1 text-xs">Marketing sprint • 4 tasks</div>
                          </div>
                          <div className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">72%</div>
                        </div>
                        <div className="landing-progress mt-3 h-2.5 overflow-hidden rounded-full">
                          <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="landing-section border-t">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Features</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                The operating system for <span className="accent-word">high-performing</span> teams
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, text }) => (
                <div key={title} className="landing-feature-card group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="landing-section-kicker text-sm font-semibold uppercase tracking-[0.2em]">Why teams choose TeamFlow</p>
              <h2 className="landing-section-title mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn planning into momentum.
              </h2>
              <p className="landing-subtitle mt-5 text-lg leading-8">
                Replace scattered tools with a focused workflow that gives every teammate visibility, accountability, and confidence.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Clear priorities for every sprint and project',
                  'Fewer blockers thanks to instant team visibility',
                  'More predictable delivery across squads and stakeholders'
                ].map((item) => (
                  <div key={item} className="landing-benefit-item flex items-start gap-3 rounded-2xl p-4">
                    <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="workflow" className="landing-workflow rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="landing-label text-xs font-medium uppercase tracking-[0.2em]">Workflow</div>
                  <div className="landing-panel-title mt-2 text-2xl font-bold">From idea to delivery</div>
                </div>
                <div className="rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="landing-workflow-item flex items-start gap-4 rounded-2xl p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="landing-copy pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta-band border-y py-20 text-white">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <FolderKanban className="h-3.5 w-3.5" />
              Ready to move faster?
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start managing work with less friction.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-indigo-100">
              Bring teams, projects, priorities, and progress into one place so execution never slows down.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-base font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-slate-100">
                Get Started
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-5 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/5">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="landing-footer-brand text-lg font-semibold tracking-tight">
              <span className="text-indigo-500">T</span>eamFlow
            </span>
          </div>
          <div className="landing-nav footer-nav flex flex-wrap items-center gap-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition">
                {item.label}
              </a>
            ))}
          </div>
          <div className="landing-footer-copy">© 2026 TeamFlow</div>
        </div>
      </footer>
    </div>
  );
}
