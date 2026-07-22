class CreateTeamMembers < ActiveRecord::Migration[8.1]
  def change
    create_table :team_members do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :role, null: false, default: "developer"
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :team_members, :email, unique: true
  end
end
