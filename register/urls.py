from django.conf.urls import url
from register import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'product_search/', views.product_search, name='product_search'),
]
