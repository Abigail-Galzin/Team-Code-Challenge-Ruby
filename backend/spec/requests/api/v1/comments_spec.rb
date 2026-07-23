require 'rails_helper'

RSpec.describe "Api::V1::Comments", type: :request do
  describe "POST /api/v1/support_requests/:support_request_id/comments" do
    let(:support_request) { FactoryBot.create(:support_request) }
    let(:team_member) { FactoryBot.create(:team_member) }

    it "creates a comment with valid attributes" do
      expect {
        post "/api/v1/support_requests/#{support_request.id}/comments", params: {
          comment: { body: "This is a valid comment body", author_email: team_member.email },
        }
      }.to change(Comment, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["message"]).to eq("The comment was created")
      expect(body["data"]["body"]).to eq("This is a valid comment body")
      expect(body["data"]["support_request_id"]).to eq(support_request.id)
      expect(body["data"]).not_to have_key("author_email")
      expect(body["data"]).not_to have_key("updated_at")
      expect(body["data"]["team_member"]).to eq("name" => team_member.name)
    end

    it "returns not_found when the support request does not exist" do
      missing_id = SupportRequest.maximum(:id).to_i + 1

      post "/api/v1/support_requests/#{missing_id}/comments", params: {
        comment: { body: "This is a valid comment body", author_email: team_member.email },
      }

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found support request")
    end

    it "returns not_found when the team member does not exist" do
      expect {
        post "/api/v1/support_requests/#{support_request.id}/comments", params: {
          comment: { body: "This is a valid comment body", author_email: "unknown@example.com" },
        }
      }.not_to change(Comment, :count)

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
    end

    it "returns not_found when the team member is inactive" do
      inactive_member = FactoryBot.create(:team_member, :inactive)

      expect {
        post "/api/v1/support_requests/#{support_request.id}/comments", params: {
          comment: { body: "This is a valid comment body", author_email: inactive_member.email },
        }
      }.not_to change(Comment, :count)

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["error"]).to eq("not found the team member")
    end

    it "returns unprocessable_entity when the body is missing" do
      post "/api/v1/support_requests/#{support_request.id}/comments", params: {
        comment: { body: "", author_email: team_member.email },
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("Body can't be blank")
    end

    it "returns unprocessable_entity when the body is too short" do
      post "/api/v1/support_requests/#{support_request.id}/comments", params: {
        comment: { body: "short", author_email: team_member.email },
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("Body is too short (minimum is 10 characters)")
    end

    it "returns bad_request when the comment key is missing" do
      post "/api/v1/support_requests/#{support_request.id}/comments", params: { body: "No wrapper key" }

      expect(response).to have_http_status(:bad_request)
    end
  end
end
