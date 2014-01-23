from django.db import models


class Place(models.Model):

	#Place Unique ID
	place_id = models.AutoField(primary_key=True)

	# Place Information
	name = models.CharField(max_length=100)
	# latitude = models.FloatField()
	# longitude = models.FloatField()
	address = models.CharField(max_length=100, blank=True)
	description = models.CharField(max_length=1000, blank=True)


class User(models.Model):
	
	# User Unique ID
	user_id = models.AutoField(primary_key=True)

	# User Information
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=50)
	places = models.ManyToManyField(Place, blank=True, null=True)

class Review(models.Model):

	# Review Unique ID
	review_id = models.AutoField(primary_key=True)
	
	# Review Information
	user = models.ForeignKey(User)
	place = models.ForeignKey(Place)
	rating = models.PositiveSmallIntegerField()
	description = models.CharField(max_length=1000)
	timestamp = models.DateTimeField(auto_now_add=True)
	