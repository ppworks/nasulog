class HomeController < ApplicationController
  def index
    @poems = Poem.all.order(id: :desc).includes(:user).page(params[:page])
    render "#{poems_path}/index" and return if current_user.present?
  end
end
