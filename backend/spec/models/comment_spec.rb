require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      comment = FactoryBot.build(:comment)
      expect(comment).to be_valid
    end

    it 'is invalid without a body' do
      comment = FactoryBot.build(:comment, body: nil)
      expect(comment).not_to be_valid
      expect(comment.errors[:body]).to include("can't be blank")
    end

    it 'is invalid with a body shorter than 10 characters' do
      comment = FactoryBot.build(:comment, body: 'short')
      expect(comment).not_to be_valid
      expect(comment.errors[:body]).to include('is too short (minimum is 10 characters)')
    end

    it 'is invalid without a support_request' do
      comment = FactoryBot.build(:comment, support_request: nil)
      expect(comment).not_to be_valid
      expect(comment.errors[:support_request]).to include('must exist')
    end

    it 'is invalid without an author_email' do
      comment = FactoryBot.build(:comment, author_email: nil)
      expect(comment).not_to be_valid
      expect(comment.errors[:team_member]).to include('must exist')
    end

    it 'is invalid when author_email does not match an existing team_member' do
      comment = FactoryBot.build(:comment, author_email: 'unknown@example.com')
      expect(comment).not_to be_valid
      expect(comment.errors[:team_member]).to include('must exist')
    end
  end

  describe 'associations' do
    it 'belongs to a support_request' do
      support_request = FactoryBot.create(:support_request)
      comment = FactoryBot.create(:comment, support_request: support_request)
      expect(comment.support_request).to eq(support_request)
    end

    it 'belongs to a team_member through author_email' do
      team_member = FactoryBot.create(:team_member)
      comment = FactoryBot.create(:comment, author_email: team_member.email)
      expect(comment.team_member).to eq(team_member)
    end
  end
end
