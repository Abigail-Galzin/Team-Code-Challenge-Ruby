import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../views/Dashboard/Dashboard";
import { SupportRequestList } from "../views/SupportRequestList/SupportRequestList";
import { RequestForm } from "../views/RequestForm/RequestForm";
import { RequestDetails } from "../views/RequestDetails/RequestDetails";
import { TeamMembers } from "../views/TeamMembers/TeamMembers";
import { ComponentsDemo } from "../views/ComponentsDemo/ComponentsDemo";
import { TeamMemberForm } from "../views/TeamMemberForm/TeamMemberForm";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/requests" element={<SupportRequestList />} />
      <Route path="/requests/new" element={<RequestForm />} />
      <Route path="/requests/:id" element={<RequestDetails />} />
      <Route path="/requests/:id/edit" element={<RequestForm />} />
      <Route path="/team-members" element={<TeamMembers />} />
      <Route path="/team-members/new" element={<TeamMemberForm />} />
      <Route path="/components" element={<ComponentsDemo />} />
    </Routes>
  );
}
