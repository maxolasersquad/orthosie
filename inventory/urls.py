from django.conf.urls import url
from inventory import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'update_grocery', views.update_grocery, name='update_grocery'),
    url(r'create_grocery', views.create_grocery, name='create_grocery'),
    url(r'update_produce', views.update_produce, name='update_produce'),
    url(r'create_produce', views.create_produce, name='create_produce'),
]
