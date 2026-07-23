class CreateComments < ActiveRecord::Migration[8.1]
  def change
    create_table :comments do |t|
      t.text :body, null: false
      t.string :author_email, null: false
      t.references :support_request, null: false, foreign_key: true

      t.timestamps
    end
    add_index :comments, :author_email
    add_foreign_key :comments, :team_members, column: :author_email, primary_key: :email

    change_column_default :support_requests, :created_at, from: nil, to: -> { "CURRENT_TIMESTAMP" }
    change_column_default :support_requests, :updated_at, from: nil, to: -> { "CURRENT_TIMESTAMP" }
  end
end
