module WelcomeHelper
	def google_maps_api_key
    	"AIzaSyDWuJQ9I7VNlCE1GMswlE0xzqDZgWbzW-E"
	end
	def google_api_url
		"http://maps.googleapis.com/maps/api/js"
	end
	def google_api_access
		"#{google_api_url}?key=#{google_maps_api_key}&libraries=places&sensor=true"
	end
	def google_maps_api
		content_tag(:script,:type => "text/javascript",:src => google_api_access) do
	end
  end
end
