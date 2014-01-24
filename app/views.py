from django.shortcuts import render
import json
from django.http import HttpResponse

from app.models import *

# Create your views here.

# def main(request):
# 	return render(request, "app/main.html")

def signin(request):
	return render(request, "app/signin.html")

def signup(request):
	return render(request, "app/signup.html")

def index(request):
	try:
		email = request.session["compleat/email"]
		user = User.objects.get(email=email)
		return render(request, "app/main.html")
	except:
		return render(request, "app/index.html")

def logout(request):
	result = {}
	try:
		del request.session["compleat/email"]
	except:
		None
	result["status"] = "success"
	return HttpResponse(json.dumps(result), content_type="application/json")

def validate_old_user(request):
	email = request.GET['email']
	password = request.GET['password']
	result = {}
	try:
		user = User.objects.get(email=email, password=password)
		result["status"] = "success"
		result["account"] = email
		request.session["compleat/email"] = email
	except:
		result["status"] = "failure"
	return HttpResponse(json.dumps(result), content_type="application/json")	
	

def validate_new_user(request):
	
	## Fields
	first_name = request.GET['first_name']
	last_name = request.GET['last_name']
	email = request.GET['email']
	password = request.GET['password']

	result = {}
	try:
		user = User.objects.get(email=email)
		result["status"] = "failure"
	except:
		result["account"] = email
		User.objects.create(first_name=first_name,last_name=last_name,email=email,password=password)
		try:
			request.session["compleat/email"] = email
			result["status"] = "success"
		except:
			result["status"] = "failure"
	return HttpResponse(json.dumps(result), content_type="application/json")

def add_user_place(request):

	place_name = request.GET['name']
	place_address = request.GET['address']
	result = {}
	try:
		email = request.session['compleat/email']
		user = User.objects.get(email=email)
		place = Place.objects.get(name=name, address=address)
		user.places.add(place)
		user.save()
		result["status"] = "success"
	except:
		result["status"] = "failure"
	return HttpResponse(json.dumps(result), content_type="application/json")


# def login(request):
# 	return render(request, "app/login.html")


# def user_show(request):
# 	return render(request, "app/index.html")

# def test_ajax(request):
# 	data = request.GET['data']
# 	data2 = request.GET['data2']
# 	response = {}
# 	response['a'] = data
# 	response['b'] = data2
# 	return HttpResponse(json.dumps(response), content_type="application/json")