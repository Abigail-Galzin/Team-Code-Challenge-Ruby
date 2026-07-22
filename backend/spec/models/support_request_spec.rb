require 'rails_helper'

RSpec.describe SupportRequest, type: :model do
  describe 'validations' do

    it 'is valid with valid attributes' do
      support_request = FactoryBot.build(:support_request)
      expect(support_request).to be_valid
    end

    it 'is invalid without a title' do
      support_request = FactoryBot.build(:support_request, title: nil)

      expect(support_request).not_to be_valid
      expect(support_request.errors[:title]).to include("can't be blank")
    end

    it 'is invalid without a description' do
      support_request = FactoryBot.build(:support_request, description: nil)

      expect(support_request).not_to be_valid
      expect(support_request.errors[:description]).to include("can't be blank")
    end

    it 'defaults to open status' do
      support_request = SupportRequest.new(title: 'Title', description: 'Description')
      expect(support_request.status).to eq('open')
    end

    it 'defaults to medium priority' do
      support_request = SupportRequest.new(title: 'Title', description: 'Description')
      expect(support_request.priority).to eq('medium')
    end

    it 'is invalid with a status not in the enum' do
      support_request = FactoryBot.build(:support_request, status: 'cancelled')
      expect(support_request).to_not be_valid
      expect(support_request.errors[:status]).to include("is not included in the list")
    end

    it 'accepts all valid statuses' do
      %w[open in_progress resolved closed].each do |status|
        support_request = FactoryBot.build(:support_request, status: status)
        expect(support_request).to be_valid
      end
    end

    it 'is invalid with a priority not in the enum' do
      support_request = FactoryBot.build(:support_request, priority: 'urgent')
      expect(support_request).to_not be_valid
      expect(support_request.errors[:priority]).to include("is not included in the list")
    end

    it 'accepts all valid priorities' do
      %w[low medium high critical].each do |priority|
        support_request = FactoryBot.build(:support_request, priority: priority)
        expect(support_request).to be_valid
      end
    end

    it 'is valid without a due_date' do
      support_request = FactoryBot.build(:support_request, due_date: nil)
      expect(support_request).to be_valid
    end

    it 'is valid without a team_member' do
      support_request = FactoryBot.build(:support_request, team_member: nil)
      expect(support_request).to be_valid
    end

    it 'is invalid when team_member_id does not reference an existing team_member' do
      support_request = FactoryBot.build(:support_request, team_member_id: TeamMember.maximum(:id).to_i + 1)

      expect(support_request).to_not be_valid
      expect(support_request.errors[:team_member]).to include("must exist")
    end

    it 'is invalid with an inactive team_member' do
      inactive_member = FactoryBot.create(:team_member, :inactive)
      support_request = FactoryBot.build(:support_request, team_member: inactive_member)

      expect(support_request).to_not be_valid
      expect(support_request.errors[:team_member]).to include("must be active")
    end

    it 'is valid with an active team_member' do
      active_member = FactoryBot.create(:team_member, active: true)
      support_request = FactoryBot.build(:support_request, team_member: active_member)

      expect(support_request).to be_valid
    end
  end

  describe 'completed_at' do
    it 'is set automatically when the status becomes resolved' do
      support_request = FactoryBot.create(:support_request, :resolved)
      expect(support_request.completed_at).to be_present
    end

    it 'is not set when the status is not resolved' do
      support_request = FactoryBot.create(:support_request)
      expect(support_request.completed_at).to be_nil
    end

    it 'is cleared when the status moves away from resolved' do
      support_request = FactoryBot.create(:support_request, :resolved)
      support_request.update(status: 'closed')

      expect(support_request.completed_at).to be_nil
    end
  end
end
