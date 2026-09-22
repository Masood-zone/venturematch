import { adminRepository } from "@/server/repositories/admin.repository";
import { matchingRepository } from "@/server/repositories/matching.repository";
import Link from "next/link";
import type { Metadata } from "next";
import { MaterialSymbol } from "@/components/ui/material-symbol";
export const metadata: Metadata = { title: "Configuration — Admin" };

export default async function AdminConfigurationPage() {
  const [settings, configs] = await Promise.all([
    adminRepository.getAllSettings(),
    matchingRepository.getAllConfigs(),
  ]);
  const activeConfig = configs.find(c => c.active);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-navy-deep">System Configuration</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Matching weights, feature flags, and platform settings.</p>
      </div>

      {/* Matching config */}
      <div className="bg-surface-pure rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title-md text-title-md text-navy-deep font-semibold">Matching Configuration</h2>
          {activeConfig && <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">v{activeConfig.version} active</span>}
        </div>
        {activeConfig ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Capability", value: activeConfig.capabilityWeight * 100 },
              { label: "Interest", value: activeConfig.interestWeight * 100 },
              { label: "Commitment", value: activeConfig.commitmentWeight * 100 },
              { label: "Availability", value: activeConfig.availabilityWeight * 100 },
              { label: "Goal", value: activeConfig.goalWeight * 100 },
              { label: "Working Style", value: activeConfig.workingStyleWeight * 100 },
              { label: "Evidence", value: activeConfig.evidenceWeight * 100 },
            ].map(w => (
              <div key={w.label} className="p-3 rounded-xl bg-surface-subtle text-center">
                <p className="font-headline-sm text-headline-sm text-navy-deep font-bold">{w.value}%</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{w.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">No active configuration. Default weights in use.</p>
        )}
        <div className="flex gap-2">
          <Link href="/api/v1/admin/matching/configs" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-navy-deep text-on-primary font-label-md text-label-md shadow-sm hover:bg-on-primary-fixed transition-all">
            <MaterialSymbol icon="add" className="text-[18px]" />
            Create New Config
          </Link>
        </div>
        {configs.length > 0 && (
          <div className="mt-4 space-y-2">
            {configs.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle">
                <div>
                  <span className="font-label-md text-label-md text-navy-deep font-semibold">Version {c.version}</span>
                  {c.active && <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">Active</span>}
                </div>
                {!c.active && (
                  <form action={`/api/v1/admin/matching/configs/${c.id}/activate`} method="POST">
                    <button type="submit" className="h-8 px-3 bg-teal-accent text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-secondary transition-all">Activate</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System settings */}
      <div className="bg-surface-pure rounded-2xl shadow-sm p-6">
        <h2 className="font-title-md text-title-md text-navy-deep font-semibold mb-4">System Settings ({settings.length})</h2>
        {settings.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant">No system settings configured yet.</p>
        ) : (
          <div className="space-y-2">
            {settings.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle">
                <div>
                  <p className="font-label-md text-label-md text-navy-deep font-semibold">{s.key}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant truncate max-w-xs">{s.value}</p>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Updated {new Date(s.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
        <form action="/api/v1/admin/settings" method="PATCH" className="mt-4 flex gap-2">
          <input name="key" type="text" placeholder="Setting key" className="flex-1 h-10 px-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40" />
          <input name="value" type="text" placeholder="Value" className="flex-1 h-10 px-3 rounded-lg bg-surface-subtle text-on-surface font-body-md text-body-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-teal-accent/40" />
          <button type="submit" className="h-10 px-4 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl shadow-sm hover:bg-on-primary-fixed transition-all">Save</button>
        </form>
      </div>
    </div>
  );
}
