# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

team_members = [
  { name: "Abigail Galzin", email: "abigail.galzin@assuresoft.com", role: "developer", active: true },
  { name: "Christian Alba", email: "mcguiver.alba@assuresoft.com", role: "qa", active: true },
  { name: "Ronald Luna", email: "ronald.luna@assuresoft.com", role: "support", active: true },
  { name: "Sheila Salinas", email: "sheila.salinas@assuresoft.com", role: "qa", active: false },
].map do |attrs|
  TeamMember.find_or_create_by!(email: attrs[:email]) do |tm|
    tm.name = attrs[:name]
    tm.role = attrs[:role]
    tm.active = attrs[:active]
  end
end

support_requests = [
  {
    title: "Login page throws 500 error",
    description: "Users report a server error when submitting the login form.",
    status: "open",
    priority: "high",
    team_member: team_members[0]
  },
  {
    title: "Slow response on dashboard",
    description: "Dashboard takes more than 10 seconds to load for some accounts.",
    status: "in_progress",
    priority: "medium",
    team_member: team_members[1]
  },
  {
    title: "Export to CSV missing columns",
    description: "The exported CSV file is missing the status column.",
    status: "resolved",
    priority: "low",
    team_member: team_members[2]
  },
  {
    title: "Incorrect data display in reports",
    description: "Reported data does not match the actual database values.",
    status: "resolved",
    priority: "high",
    team_member: team_members[3]
  }
].map do |attrs|
  SupportRequest.find_or_create_by!(title: attrs[:title]) do |sr|
    sr.description = attrs[:description]
    sr.status = attrs[:status]
    sr.priority = attrs[:priority]
    sr.team_member = attrs[:team_member]
  end
end

support_requests.each do |support_request|
  2.times do |n|
    author = team_members[n % team_members.size]

    Comment.find_or_create_by!(
      support_request: support_request,
      author_email: author.email,
      body: "Comment ##{n + 1} for '#{support_request.title}'."
    )
  end
end
