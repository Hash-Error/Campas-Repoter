import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminPanel as AdminDashboard } from "./components/AdminPanel";
import { ReportIssue } from "./components/ReportIssue";
import { IssueDetails } from "./components/IssueDetails";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "report", Component: ReportIssue },
      { path: "admin", Component: AdminDashboard },
      { path: "issue/:id", Component: IssueDetails },
    ],
  },
]);
