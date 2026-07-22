class AllowNullUpdatedAtOnSupportRequests < ActiveRecord::Migration[8.1]
  def change
    change_column_null :support_requests, :updated_at, true
  end
end
