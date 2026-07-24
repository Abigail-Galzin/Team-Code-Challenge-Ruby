require 'rails_helper'

RSpec.describe TeamMember, type: :model do
  subject { FactoryBot.build(:team_member) }

  describe 'associations' do
    it 'has many support requests and destroys them when deleted' do
      association = described_class.reflect_on_association(:support_requests)

      expect(association.macro).to eq(:has_many)
      expect(association.options[:dependent]).to eq(:destroy)
    end
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(subject).to be_valid
    end

    it 'requires a name' do
      subject.name = nil

      expect(subject).not_to be_valid
      expect(subject.errors[:name]).to include("can't be blank")
    end

    it 'limits the name to 100 characters' do
      subject.name = 'a' * 101

      expect(subject).to_not be_valid
      expect(subject.errors[:name]).to include("is too long (maximum is 100 characters)")
    end

    it 'requires an email' do
      subject.email = nil

      expect(subject).not_to be_valid
      expect(subject.errors[:email]).to include("can't be blank")
    end

    it 'requires a valid email format' do
      subject.email = 'invalid_email'

      expect(subject).to_not be_valid
      expect(subject.errors[:email]).to include("must be a valid email address")
    end

    it 'requires a unique email address case-insensitively' do
      FactoryBot.create(:team_member, email: 'test@example.com')
      subject.email = 'TEST@example.com'

      expect(subject).to_not be_valid
      expect(subject.errors[:email]).to include("has already been taken")
    end

    it 'requires a valid role' do
      subject.role = 'ceo'

      expect(subject).to_not be_valid
      expect(subject.errors[:role]).to include("is not included in the list")
    end

    it 'requires role presence' do
      subject.role = nil

      expect(subject).to_not be_valid
      expect(subject.errors[:role]).to include("can't be blank")
    end

    it 'requires active to be true or false' do
      subject.active = nil

      expect(subject).to_not be_valid
      expect(subject.errors[:active]).to include("is not included in the list")
    end

    it 'allows an active member to become inactive' do
      member = FactoryBot.create(:team_member, active: true)
      member.active = false

      expect(member).to be_valid
    end

    it 'does not allow an inactive member to become active again' do
      member = FactoryBot.create(:team_member, :inactive)
      member.active = true

      expect(member).to_not be_valid
      expect(member.errors[:active]).to include("cannot be reactivated once deactivated")
    end

    it 'does not raise validation errors when active is unchanged' do
      member = FactoryBot.create(:team_member, :inactive)
      member.name = 'Updated Name'

      expect(member).to be_valid
    end

    it 'accepts valid enum roles' do
      %w[developer qa support].each do |role|
        subject.role = role
        expect(subject).to be_valid
      end
    end
  end

  describe 'scopes' do
    describe '.by_active' do
      it 'returns all members when active is blank' do
        active_member = FactoryBot.create(:team_member, active: true)
        inactive_member = FactoryBot.create(:team_member, active: false)

        expect(TeamMember.by_active(nil)).to include(active_member, inactive_member)
      end

      it 'returns only active members when given true' do
        active_member = FactoryBot.create(:team_member, active: true)
        FactoryBot.create(:team_member, active: false)

        expect(TeamMember.by_active('true')).to include(active_member)
        expect(TeamMember.by_active('true')).not_to include(TeamMember.find_by(active: false))
      end

      it 'returns only inactive members when given false' do
        inactive_member = FactoryBot.create(:team_member, active: false)
        FactoryBot.create(:team_member, active: true)

        expect(TeamMember.by_active('false')).to include(inactive_member)
        expect(TeamMember.by_active('false')).not_to include(TeamMember.find_by(active: true))
      end
    end

    describe '.by_role' do
      it 'returns all members when role is blank or undefined' do
        all_members = FactoryBot.create_list(:team_member, 2)

        expect(TeamMember.by_role(nil)).to match_array(all_members)
        expect(TeamMember.by_role('undefined')).to match_array(all_members)
        expect(TeamMember.by_role('null')).to match_array(all_members)
      end

      it 'filters by role when role is provided' do
        developer = FactoryBot.create(:team_member, role: 'developer')
        qa_member = FactoryBot.create(:team_member, role: 'qa')

        expect(TeamMember.by_role('qa')).to include(qa_member)
        expect(TeamMember.by_role('qa')).not_to include(developer)
      end
    end

    describe '.search_by_name' do
      it 'returns all members when search is blank' do
        members = FactoryBot.create_list(:team_member, 2)

        expect(TeamMember.search_by_name(nil)).to match_array(members)
      end

      it 'returns members matching a partial, case-insensitive name' do
        matching = FactoryBot.create(:team_member, name: 'Alicia Anderson')
        FactoryBot.create(:team_member, name: 'Other User')

        expect(TeamMember.search_by_name('alicia')).to include(matching)
        expect(TeamMember.search_by_name('alicia')).not_to include(TeamMember.find_by(name: 'Other User'))
      end
    end
  end
end
