require 'rails_helper'

RSpec.describe "Api::V1::SupportRequests", type: :request do
  describe "GET /api/v1/support_requests" do
    it "returns a successful paginated response" do
      FactoryBot.create_list(:support_request, 3)

      get "/api/v1/support_requests"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["message"]).to eq("The support request return correctly")
      expect(body["status"]).to eq("ok")
      expect(body["data"].size).to eq(3)
      expect(body["pagination"]).to include("page" => 1, "count" => 3)
    end

    it "excludes created_at and updated_at from the serialized records" do
      FactoryBot.create(:support_request)

      get "/api/v1/support_requests"

      record = JSON.parse(response.body)["data"].first
      expect(record).not_to have_key("created_at")
      expect(record).not_to have_key("updated_at")
    end

    it "includes the associated team member" do
      team_member = FactoryBot.create(:team_member)
      FactoryBot.create(:support_request, team_member: team_member)

      get "/api/v1/support_requests"

      record = JSON.parse(response.body)["data"].first
      expect(record["team_member"]).to include(
        "name" => team_member.name,
        "email" => team_member.email,
        "role" => team_member.role,
        "active" => team_member.active,
      )
    end

    it "respects the client_max_limit when paginating" do
      FactoryBot.create_list(:support_request, 15)

      get "/api/v1/support_requests", params: { limit: 50 }

      body = JSON.parse(response.body)
      expect(body["pagination"]["limit"]).to eq(10)
      expect(body["data"].size).to eq(10)
    end
  end

  describe "POST /api/v1/support_requests" do
    let(:valid_attributes) do
      {
        title: "Printer not working",
        description: "The office printer is jammed",
        status: "open",
        priority: "high",
      }
    end

    it "creates a support request with valid attributes" do
      expect {
        post "/api/v1/support_requests", params: { support_request: valid_attributes }
      }.to change(SupportRequest, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["message"]).to eq("The support request was created")
      expect(body["data"]["title"]).to eq("Printer not working")
    end

    it "creates a support request associated with an active team member" do
      team_member = FactoryBot.create(:team_member)

      post "/api/v1/support_requests", params: {
        support_request: valid_attributes.merge(team_member_id: team_member.id),
      }

      expect(response).to have_http_status(:created)
      expect(SupportRequest.last.team_member_id).to eq(team_member.id)
    end

    it "returns not_found when the team member does not exist" do
      missing_id = TeamMember.maximum(:id).to_i + 1

      expect {
        post "/api/v1/support_requests", params: {
          support_request: valid_attributes.merge(team_member_id: missing_id),
        }
      }.not_to change(SupportRequest, :count)

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
    end

    it "returns not_found when the team member is inactive" do
      inactive_member = FactoryBot.create(:team_member, :inactive)

      expect {
        post "/api/v1/support_requests", params: {
          support_request: valid_attributes.merge(team_member_id: inactive_member.id),
        }
      }.not_to change(SupportRequest, :count)

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
    end

    it "returns unprocessable_entity when required attributes are missing" do
      post "/api/v1/support_requests", params: { support_request: valid_attributes.merge(title: nil) }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("Title can't be blank")
    end

    it "returns bad_request when the support_request key is missing" do
      post "/api/v1/support_requests", params: { title: "No wrapper key" }

      expect(response).to have_http_status(:bad_request)
    end
  end

  describe "GET /api/v1/support_requests/:id" do
    it "returns the support request" do
      support_request = FactoryBot.create(:support_request, title: "Broken monitor")

      get "/api/v1/support_requests/#{support_request.id}"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["message"]).to eq("Support request was found")
      expect(body["data"]["id"]).to eq(support_request.id)
      expect(body["data"]["title"]).to eq("Broken monitor")
    end

    it "returns not_found when the support request does not exist" do
      get "/api/v1/support_requests/999999"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found support request")
    end

    it "includes the associated team member" do
      team_member = FactoryBot.create(:team_member)
      support_request = FactoryBot.create(:support_request, team_member: team_member)

      get "/api/v1/support_requests/#{support_request.id}"

      record = JSON.parse(response.body)["data"]
      expect(record["team_member"]).to include(
        "name" => team_member.name,
        "email" => team_member.email,
        "role" => team_member.role,
        "active" => team_member.active,
      )
    end
  end

  describe "PATCH /api/v1/support_requests/:id" do
    it "updates a support request with valid attributes" do
      support_request = FactoryBot.create(:support_request, status: "open", priority: "low")

      patch "/api/v1/support_requests/#{support_request.id}", params: {
        support_request: { status: "in_progress", priority: "high" },
      }

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["message"]).to eq("The support request was updated")
      expect(body["data"]["status"]).to eq("in_progress")
      expect(body["data"]["priority"]).to eq("high")
    end

    it "returns not_found when the support request does not exist" do
      patch "/api/v1/support_requests/999999", params: { support_request: { status: "resolved" } }

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found support request")
    end

    it "reassigns the support request to a new active team member" do
      support_request = FactoryBot.create(:support_request)
      new_member = FactoryBot.create(:team_member)

      patch "/api/v1/support_requests/#{support_request.id}", params: {
        support_request: { team_member_id: new_member.id },
      }

      expect(response).to have_http_status(:ok)
      expect(support_request.reload.team_member_id).to eq(new_member.id)
    end

    it "returns not_found when reassigning to a team member that does not exist" do
      support_request = FactoryBot.create(:support_request)
      missing_id = TeamMember.maximum(:id).to_i + 1

      patch "/api/v1/support_requests/#{support_request.id}", params: {
        support_request: { team_member_id: missing_id },
      }

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
      expect(support_request.reload.team_member_id).to be_nil
    end

    it "returns not_found when reassigning to an inactive team member" do
      support_request = FactoryBot.create(:support_request)
      inactive_member = FactoryBot.create(:team_member, :inactive)

      patch "/api/v1/support_requests/#{support_request.id}", params: {
        support_request: { team_member_id: inactive_member.id },
      }

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
    end

    it "returns unprocessable_entity when the update is invalid" do
      support_request = FactoryBot.create(:support_request)

      patch "/api/v1/support_requests/#{support_request.id}", params: {
        support_request: { title: "", priority: "urgent" },
      }

      expect(response).to have_http_status(:unprocessable_entity)
      errors = JSON.parse(response.body)["error"]
      expect(errors).to include("Title can't be blank")
      expect(errors).to include("Priority is not included in the list")
    end
  end
end
