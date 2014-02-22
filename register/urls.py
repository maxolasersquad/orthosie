from django.conf.urls import patterns, url
from register import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'process_upc/', views.process_upc, name='process_upc'),
    url(r'tender_transaction/', views.tender_transaction, name='tender_transaction'),
    url(r'end_shift/', views.end_shift, name='end_shift'),
    url(r'product_search/', views.product_search, name='product_search'),
)
