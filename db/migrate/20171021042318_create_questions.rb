class CreateQuestions < ActiveRecord::Migration[5.1]
  def change
    create_table :questions do |t|
      t.string :title
      t.string :location
      t.text :body
      t.string :status
      t.string :department
      t.boolean :resolved

      t.timestamps
    end
  end
end
