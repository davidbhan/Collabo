class UsersController < ApplicationController
	def show
		@user = current_user
		@user_questions = @user.questions
	end
end
