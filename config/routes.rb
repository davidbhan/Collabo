Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'tags/:tag', to: "questions#index", as: :tag
  resources :questions
  root "questions#index"
end
