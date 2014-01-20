json.array!(@users) do |user|
  json.extract! user, :id, :username, :firstname, :lastname, :password, :visited, :email
  json.url user_url(user, format: :json)
end
