class UsersController < ApplicationController
	def index
		@questions = Question.all
		@user_id = current_user.id
		@questions = @questions.where(claimed_by: @user_id)
	end
	def show
		@user = current_user
		@user_questions = @user.questions
	end

	
end
