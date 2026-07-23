class Comment < ApplicationRecord
  belongs_to :support_request
  belongs_to :team_member, foreign_key: :author_email, primary_key: :email

  validates :body, presence: true, length: { minimum: 10}
end
