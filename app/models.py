from django.db import models


class Place(models.Model):

	#Place Unique ID
	google_id = models.CharField(primary_key=True,max_length=200,editable=False)

	# Place Information
	name = models.CharField(max_length=100)
	address = models.CharField(max_length=100, blank=True)
	description = models.CharField(max_length=1000, blank=True)

	def __unicode__(self):
		return self.name


class User(models.Model):
	
	# User Unique ID
	user_id = models.AutoField(primary_key=True)

	# User Information
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=50)
	places = models.ManyToManyField(Place, blank=True)

	def __unicode__(self):
		return self.email

	def getHistory(self):
		output = []
		for place in self.places.all():
			addon = {"id" : place.google_id, "name" : place.name}
			output.append(addon)
		return output


class Review(models.Model):

	# Review Unique ID
	review_id = models.AutoField(primary_key=True)
	
	# Review Information
	user = models.ForeignKey(User)
	place = models.ForeignKey(Place)
	rating = models.PositiveSmallIntegerField()
	description = models.CharField(max_length=1000)
	timestamp = models.DateTimeField(auto_now_add=True)
	
	def __unicode__(self):
		return self.user.email + " for " + self.place.name	