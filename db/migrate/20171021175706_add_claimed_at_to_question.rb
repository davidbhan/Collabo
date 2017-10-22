class AddClaimedAtToQuestion < ActiveRecord::Migration[5.1]
  def change
    add_column :questions, :claimed_at, :datetime
  end
end
