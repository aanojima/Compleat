class UserController < Devise::RegistrationsController

	def new
		@user=User.new
	end

	def create
		@user=User.new(user_params)
		@user.valid?
		if @user.errors.blank?
			@user.save
			flash[:success]="You have successfully created an account!"
			redirect_to user_path
		else
			flash[:error]="Something went wrong, please try again."
			render :action => "new"
		end
	end

end