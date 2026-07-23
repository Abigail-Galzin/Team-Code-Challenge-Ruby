class SupportRequest < ApplicationRecord
  self.record_timestamps = false

  belongs_to :team_member,  optional: true
  has_many :comments, dependent: :destroy

  scope :overdue, -> { where.not(status: %w[resolved closed]).where("due_date < ?", Date.current) }
  scope :by_status,      ->(status)   { where(status: status) }
  scope :by_priority,    ->(priority) { where(priority: priority) }
  scope :assigned_to,    ->(team_member_id) { where(team_member_id: team_member_id) }
  scope :unassigned,     -> { where(team_member_id: nil) }
  scope :search_by_title, ->(query) { where("title ILIKE ?", "%#{sanitize_sql_like(query)}%") }

  enum :status, {
    open:"open",
    in_progress:"in_progress",
    resolved:"resolved",
    closed:"closed"
  }, validate: true

   enum :priority, {
    low:"low",
    medium:"medium",
    high:"high",
    critical:"critical"
  }, validate: true


 validates :title, presence: true
 validates :description, presence: true
 validates :status, presence: true
 validates :priority, presence: true

 validate :team_member_must_exist_and_be_active
 validate :closed_request_cannot_be_edited, on: :update
 validate :resolved_request_cannot_become_closed, on: :update

 before_create :set_created_at
 before_update :set_updated_at
 before_save :set_completed_at

 def overdue?
   due_date.present? && due_date < Date.current && !status.in?(%w[resolved closed])
 end
 alias_method :overdue, :overdue?

 private

 def set_created_at
   self.created_at ||= Time.current
 end

 def set_updated_at
   self.updated_at = Time.current
 end

 def team_member_must_exist_and_be_active
   return if team_member_id.blank?

   if team_member.nil?
     errors.add(:team_member, "must exist")
   elsif !team_member.active?
     errors.add(:team_member, "must be active")
   end
 end

 def closed_request_cannot_be_edited
   return unless status_was == "closed"

   errors.add(:base, "closed requests cannot be edited")
 end

 def resolved_request_cannot_become_closed
   return unless status_was == "resolved" && status == "closed"

   errors.add(:status, "cannot change from resolved to closed")
 end

 def set_completed_at
   return unless status_changed?

   if resolved?
     self.completed_at ||= Time.current
   else
     self.completed_at = nil
   end
 end
end
