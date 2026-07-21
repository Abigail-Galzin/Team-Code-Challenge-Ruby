class TeamMember < ApplicationRecord
  enum :role, {
    developer: 0,
    qa: 1,
    support: 2
  }, validate: true

  scope :active, -> { where(active: true)}

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true,
    uniqueness: { case_sensitive: false },
    format: {
      with: URI::MailTo::EMAIL_REGEXP,
      message: "must be a valid email address"
    }
  validates :role, presence: true, inclusion: { in: roles.keys }
  validates :active, inclusion: { in: [true, false] }

end
