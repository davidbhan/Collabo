class QuestionsController < ApplicationController
	def index

		if params[:tag]
			@questions = Question.tagged_with(params[:tag])
			if params["title"]
				@questions = @questions.where(title: params["title"]).order("created_at DESC")
			end
		else
			@questions = Question.all
			if params["title"]
				@questions =  @questions.where(title: params["title"]).order("created_at DESC")
			end
		end
		
	end


	def new
		
		@question = current_user.questions.build
	end

	def create		
		@question = current_user.questions.new(question_params)
		if @question.save
			redirect_to @question
		else
			render 'new'
		end
	end
	def claim
		@question = Question.find(params[:id])
		@question.update_attribute(:claimed_at, Time.now)
		@user_id = current_user.email
		
		@question.update_attribute(:claimed_by, @user_id)
			flash[:notice] = "Successfully claimed the question! Keep collaborating! :)"
		
		redirect_to @question 

	end

	def show
		@question = Question.find(params[:id])
	end

	def edit
		@question = Question.find(params[:id])
	end

	def update
		@question = Question.find(params[:id])
		if @question.update(params[:question].permit(:title, :status))
			redirect_to @update
		else
			render 'edit'
		end
	end

	def destroy
		@question = Question.find(params[:id])
		@question.destroy
		redirect_to root_path
	end


	private
		def question_params
			params.require(:question).permit(:title, :status, :tag_names, :body, :tag_list)
		end

end

