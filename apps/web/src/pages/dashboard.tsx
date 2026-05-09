import { AppSidebar } from "../components/app-sidebar";
import { DashboardHomeContent } from "../components/dashboard-home-content";

export function DashboardPage() {
  return (
    <AppSidebar>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[50vh] flex-1 rounded-none border bg-muted/20 p-6 md:min-h-min">
          <DashboardHomeContent />
        </div>
      </div>
    </AppSidebar>
  );
}
