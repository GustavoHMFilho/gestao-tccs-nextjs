import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceList } from "@/components/resource-list";
import { resourceConfigs } from "@/lib/resources";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const config = resourceConfigs[resource];
  if (!config) notFound();
  return <div className="page"><PageHeader eyebrow="Cadastros acadêmicos" title={config.title} description={config.description} /><ResourceList resource={resource} /></div>;
}
