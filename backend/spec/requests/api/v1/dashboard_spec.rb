require 'rails_helper'

RSpec.describe "Api::V1::Dashboard", type: :request do
  describe "GET /api/v1/dashboard" do
    it "returns zeroed counts when there are no support requests" do
      get "/api/v1/dashboard"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)

      expect(body["message"]).to eq("Dashboard stats returned correctly")
      expect(body["status"]).to eq("ok")
      expect(body["data"]).to eq(
        "total_requests" => 0,
        "overdue_requests" => 0,
        "unassigned_requests" => 0,
        "requests_by_status" => {
          "open" => 0, "in_progress" => 0, "resolved" => 0, "closed" => 0,
        },
        "requests_by_priority" => {
          "low" => 0, "medium" => 0, "high" => 0, "critical" => 0,
        },
      )
    end

    it "returns accurate aggregate counts" do
      team_member = FactoryBot.create(:team_member)

      FactoryBot.create(:support_request, status: "open", priority: "low", due_date: Date.yesterday)
      FactoryBot.create(:support_request, status: "open", priority: "medium", team_member: team_member)
      FactoryBot.create(:support_request, :in_progress, priority: "high", due_date: Date.tomorrow)
      FactoryBot.create(:support_request, :resolved, priority: "critical", due_date: Date.yesterday)
      FactoryBot.create(:support_request, status: "closed", priority: "medium", due_date: Date.yesterday)

      get "/api/v1/dashboard"

      data = JSON.parse(response.body)["data"]

      expect(data["total_requests"]).to eq(5)
      # only open/in_progress records with a past due_date count as overdue
      expect(data["overdue_requests"]).to eq(1)
      expect(data["unassigned_requests"]).to eq(4)
      expect(data["requests_by_status"]).to eq(
        "open" => 2, "in_progress" => 1, "resolved" => 1, "closed" => 1,
      )
      expect(data["requests_by_priority"]).to eq(
        "low" => 1, "medium" => 2, "high" => 1, "critical" => 1,
      )
    end
  end
end
