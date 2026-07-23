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
  end
end
