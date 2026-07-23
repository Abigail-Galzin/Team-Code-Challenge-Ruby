class SupportRequest < ApplicationRecord
  self.record_timestamps = false

  belongs_to :team_member,  optional: true

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

 before_create :set_created_at
 before_update :set_updated_at
 before_save :set_completed_at

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

 def set_completed_at
   return unless status_changed?

   if resolved?
     self.completed_at ||= Time.current
   else
     self.completed_at = nil
   end
 end
end
