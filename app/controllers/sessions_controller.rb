class SessionsController < ApplicationController

def create
    user = User.find_by(username: params[:session][:username])
    if user && user.authenticate(params[:session][:password])
      sign_in user
      redirect_to user
    else
      flash.now[:error] = 'Invalid username/password combination'
      render 'new'
    end
end

def destroy
	if signed_in?
    	sign_out
    	redirect_to root_url
	else
		redirect_to new_session_path
    end
end

end