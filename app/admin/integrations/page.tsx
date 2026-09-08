import type { Metadata } from "next";
import { AdminPage, Panel, StatusPill } from "@/components/admin/ui";
import { integrationStatuses } from "@/lib/admin/mock";

export const metadata: Metadata = { title: "Integrations" };

export const dynamic = "force-dynamic";

export default function AdminIntegrations() {
  const items = integrationStatuses();
  const configured = items.filter((i) => i.configured).length;
  return (
    <AdminPage
      title="Integrations"
      description={`${configured} of ${items.length} configured. This screen reads the server's environment for real — when a key is added in Vercel, its card turns blue.`}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((i) => (
          <Panel
            key={i.key}
            title={i.name}
            aside={<StatusPill status={i.configured ? "connected" : "not configured"} />}
          >
            <p className="text-stone text-sm">{i.purpose}</p>
            <ul className="mt-4 space-y-1">
              {i.envVars.map((v) => (
                <li
                  key={v}
                  className="flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <span className="text-ink">{v}</span>
                  <span
                    className={
                      process.env[v] ? "text-[color:var(--nh-blue-ink)]" : "text-fog"
                    }
                  >
                    {process.env[v] ? "set" : "missing"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-fog mt-4 text-xs">Build spec {i.docsRef}</p>
          </Panel>
        ))}
      </div>
    </AdminPage>
  );
}
