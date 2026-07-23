class TeamMember < ApplicationRecord
  has_many :support_requests, dependent: :destroy

  enum :role, {
    developer: "developer",
    qa: "qa",
    support: "support"
  }, validate: true

  scope :by_active, ->(active) {
    return all if active.blank?

    status = ActiveModel::Type::Boolean.new.cast(active)
    where(active: status)
  }
  scope :by_role, ->(role) {
    return all if role.blank? || role == "undefined" || role == "null"

    where(role: role)
  }
  scope :search_by_name, ->(name) {
    return all if name.blank?

    where("LOWER(name) LIKE ?", "%#{name.strip.downcase}%")
  }

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true,
    uniqueness: { case_sensitive: false },
    format: {
      with: URI::MailTo::EMAIL_REGEXP,
      message: "must be a valid email address"
    }
  validates :role, presence: true
  validates :active, inclusion: { in: [true, false] }

end
