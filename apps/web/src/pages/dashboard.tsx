import { AppSidebar } from "../components/app-sidebar";

export function DashboardPage() {
  return (
    <AppSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-none border bg-muted/30" />
          <div className="aspect-video rounded-none border bg-muted/30" />
          <div className="aspect-video rounded-none border bg-muted/30" />
        </div>
        <div className="min-h-[50vh] flex-1 rounded-none border bg-muted/20 md:min-h-min" />
      </div>
    </AppSidebar>
  );
}
