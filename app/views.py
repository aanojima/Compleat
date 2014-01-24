from django.shortcuts import render
from django.core.context_processors import csrf
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
	except:
		result["status"] = "failure"

	try:
		place = Place.objects.get(name=place_name,address=place_address)
		result["place_status"] = "exists"
	except:
		place = Place(name=place_name, address=place_address)
		place.save()
		result["place_status"] = "created"
	user.places.add(place)
	user.save()
	result["status"] = "success"
	return HttpResponse(json.dumps(result), content_type="application/json")

def get_user_places(request):
	result = {}
	try:
		email = request.session['compleat/email']
		user = User.objects.get(email=email)
		history = user.getHistory()
		result["history"] = history
		result["status"] = "success"
	except:
		result["status"] = "failure"
	return HttpResponse(json.dumps(result), content_type="application/json")