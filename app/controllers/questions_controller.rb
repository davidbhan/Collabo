class QuestionsController < ApplicationController
	def index
		if params[:tag]
			@questions = Question.tagged_with(params[:tag]).order("created_at DESC")
		else
			@questions = Question.all.order("created_at DESC")
		end
		
	end

	def new
		@question = Question.new
	end

	def create
		@question = Question.new(question_params)
		if @question.save
			redirect_to @question
		else
			render 'new'
		end
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

