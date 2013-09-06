from django.conf.urls import patterns, url
from inventory import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)

