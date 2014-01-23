from django.conf.urls import patterns, url

from app import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^main/$', views.main, name='main'),
	url(r'^validate_old_user/$', views.validate_old_user, name="validate_old_user"),
	url(r'^validate_new_user/$', views.validate_new_user, name="validate_new_user"),
	url(r'^add_user_place/$', views.add_user_place, name="add_user_place"),
	url(r'^logout/$', views.logout, name="logout"),
	# url(r'^test_ajax/$', views.test_ajax, name='test_ajax'),
)