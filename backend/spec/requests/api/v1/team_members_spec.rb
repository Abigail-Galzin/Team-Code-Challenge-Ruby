require 'rails_helper'

RSpec.describe "Api::V1::TeamMembers", type: :request do
  describe 'POST /api/v1/team_members' do
    let(:valid_attributes) { FactoryBot.attributes_for(:team_member) }
    let(:invalid_attributes) do
      {
        team_member: {
          name: '',
          email: 'invalid_email',
          role: '',
          active: nil
        }
      }
    end

    it 'creates a team member and returns HTTP 201' do
      expect do
        post api_v1_team_members_path, params: { team_member: valid_attributes }, as: :json
      end.to change(TeamMember, :count).by(1)

      expect(response).to have_http_status(:created)
      body = JSON.parse(response.body)

      expect(body['data']['name']).to eq(valid_attributes[:name])
      expect(body['data']['email']).to eq(valid_attributes[:email])
      expect(body['data']['role']).to eq(valid_attributes[:role].to_s)
      expect(body['message']).to include('Team member')
    end

    it 'returns HTTP 422 with error messages for invalid payload' do
      expect do
        post api_v1_team_members_path, params: invalid_attributes, as: :json
      end.not_to change(TeamMember, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)

      expect(body['errors']).to include("Name can't be blank")
      expect(body['errors']).to include('Email must be a valid email address')
      expect(body['errors']).to include("Role can't be blank")
      expect(body['errors']).to include('Active is not included in the list')
    end
  end

  describe 'PATCH /api/v1/team_members/:id' do
    let!(:team_member) { FactoryBot.create(:team_member, name: 'Original Name', email: 'original@example.com', role: 'developer', active: true) }

    it 'updates the member and returns HTTP 200' do
      patch api_v1_team_member_path(team_member), params: {
        team_member: {
          name: 'Updated Name',
          email: 'updated@example.com',
          role: 'support',
          active: false
        }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(team_member.reload.name).to eq('Updated Name')
      expect(team_member.email).to eq('updated@example.com')
      expect(team_member.role).to eq('support')

      body = JSON.parse(response.body)
      expect(body['data']['name']).to eq('Updated Name')
      expect(body['data']['role']).to eq('support')
    end

    it 'returns HTTP 422 and does not update when payload is invalid' do
      expect do
        patch api_v1_team_member_path(team_member), params: {
          team_member: {
            email: 'invalid_email',
            role: 'ceo',
            active: nil
          }
        }, as: :json
      end.not_to change { team_member.reload.email }

      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)

      expect(body['errors']).to include('Email must be a valid email address')
      expect(body['errors']).to include('Role is not included in the list')
      expect(body['errors']).to include('Active is not included in the list')
    end

    it 'returns HTTP 404 when updating a non-existent member' do
      patch api_v1_team_member_path(id: '999999'), params: {
        team_member: { name: 'No One' }
      }, as: :json

      expect(response).to have_http_status(:not_found)
      body = JSON.parse(response.body)
      expect(body['error']).to eq('Team member not found')
    end

    it 'deactivates an active member and returns HTTP 200' do
      patch api_v1_team_member_path(team_member), params: {
        team_member: { active: false }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(team_member.reload.active).to eq(false)
    end

    it 'returns HTTP 422 when reactivating an inactive member' do
      team_member.update!(active: false)

      expect do
        patch api_v1_team_member_path(team_member), params: {
          team_member: { active: true }
        }, as: :json
      end.not_to change { team_member.reload.active }

      expect(response).to have_http_status(:unprocessable_entity)
      body = JSON.parse(response.body)
      expect(body['errors']).to include('Active cannot be reactivated once deactivated')
    end
  end
end
