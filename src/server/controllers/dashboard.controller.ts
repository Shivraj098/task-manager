import { getDashboardData } from "../services/dashboard.service";

export async function handleGetDashboard(userId: string) {
  return getDashboardData(userId);
}