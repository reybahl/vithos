import { AppSidebar } from "../components/AppSidebar";
import { DashboardHomeContent } from "../components/DashboardHomeContent";

export function DashboardPage() {
  return (
    <AppSidebar>
      <div className="flex flex-1 flex-col px-4 py-5 md:px-6 md:py-6">
        <DashboardHomeContent />
      </div>
    </AppSidebar>
  );
}
