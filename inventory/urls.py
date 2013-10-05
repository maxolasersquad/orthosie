from django.conf.urls import patterns, url
from inventory import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'update_inventory', views.update_inventory, name='update_inventory'),
    url(r'create_inventory', views.create_inventory, name='create_inventory'),
)

