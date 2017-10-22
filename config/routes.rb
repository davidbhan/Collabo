Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'tags/:tag', to: "questions#index", as: :tag
  resources :questions do
  	member do
  		patch :claim
  	end
  end
  resources :users
  get 'users/contribution' => 'users#contributions'
  root "questions#index"
  get 'dashboard/index'
end
