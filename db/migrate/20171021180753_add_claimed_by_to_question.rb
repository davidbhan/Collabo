class AddClaimedByToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :claimed_by, :integer
  end
end
