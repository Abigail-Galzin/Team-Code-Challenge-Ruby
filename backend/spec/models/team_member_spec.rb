require 'rails_helper'

RSpec.describe TeamMember, type: :model do
  describe 'validations' do

    it 'is valid with valid attributes' do
      team_member = FactoryBot.build(:team_member)
      expect(team_member).to be_valid
    end

    it 'is invalid without a name' do
      team_member = FactoryBot.build(:team_member, name: nil)

      expect(team_member).not_to be_valid
      expect(team_member.errors[:name]).to include("can't be blank")
    end

    it 'is invalid with a name longer than 100 characters' do
      team_member = FactoryBot.build(:team_member, name: 'a' * 101)
      expect(team_member).to_not be_valid
      expect(team_member.errors[:name]).to include("is too long (maximum is 100 characters)")
    end

    it 'is invalid without a email' do
      team_member = FactoryBot.build(:team_member, email: nil)

      expect(team_member).not_to be_valid
      expect(team_member.errors[:email]).to include("can't be blank")
    end

    it 'is invalid with a malformed email' do
      member = FactoryBot.build(:team_member, email: 'invalid_email')
      expect(member).to_not be_valid
      expect(member.errors[:email]).to include("must be a valid email address")
    end

    it 'is invalid with a duplicate email (case insensitive)' do
      FactoryBot.create(:team_member, email: 'test@example.com')
      duplicate = FactoryBot.build(:team_member, email: 'TEST@example.com')
      expect(duplicate).to_not be_valid
      expect(duplicate.errors[:email]).to include("has already been taken")
    end

    it 'is invalid with a role not in the enum' do
      member = FactoryBot.build(:team_member, role: 'ceo')
      expect(member).to_not be_valid
      expect(member.errors[:role]).to include("is not included in the list")
    end

    it 'accepts all valid roles' do
      %w[developer qa support].each do |role|
        member = FactoryBot.build(:team_member, role: role)
        expect(member).to be_valid
      end
    end
  end

  describe 'scopes' do
    it 'returns only active members with .active scope' do
      active_member = FactoryBot.create(:team_member, active: true)
      inactive_member = FactoryBot.create(:team_member, :inactive)

      expect(TeamMember.active).to include(active_member)
      expect(TeamMember.active).not_to include(inactive_member)
    end
  end
end
