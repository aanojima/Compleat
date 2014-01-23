class User < ActiveRecord::Base
	has_and_belongs_to_many :restaurants
	before_save { self.email = email.downcase }
	validates :first_name, :last_name, :username, :password_digest, presence: true
	validates :email, :username, uniqueness: {case_sensitive: false}
	validates :password, length: { minimum: 6 }
	before_create :create_remember_token
	has_secure_password

	def User.new_remember_token
    	SecureRandom.urlsafe_base64
  	end

  	def User.encrypt(token)
		Digest::SHA1.hexdigest(token.to_s)
  	end
	private

		def create_remember_token
			self.remember_token = User.encrypt(User.new_remember_token)
		end
end