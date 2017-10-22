class Question < ApplicationRecord
	
	acts_as_taggable
	belongs_to :user
	def claimed?
		!claimed_at.blank?
	end

end
