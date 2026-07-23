class CreateSupportRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :support_requests do |t|
      t.string :title, null: false
      t.string :description, null: false
      t.string :status, null: false, default: "open"
      t.string :priority, null: false, default: "medium"
      t.date :due_date
      t.datetime :completed_at
      t.references :team_member, null: true, foreign_key: true

      t.timestamps
    end

    change_column_default :support_requests, :created_at, from: nil, to: -> { "CURRENT_TIMESTAMP" }
    change_column_default :support_requests, :updated_at, from: nil, to: -> { "CURRENT_TIMESTAMP" }
  end
end
