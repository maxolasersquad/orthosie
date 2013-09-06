from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from orthosie.views import ItemList, ItemDetail, VendorList, VendorDetail, ShiftList, ShiftDetail, TransactionList, TransactionDetail, LineItemList, LineItemDetail

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^register/', include('register.urls')),
    url(r'^inventory/', include('inventory.urls')),
    url(r'^$', 'api_root'),
    url(r'^items/$', ItemList.as_view(), name='item-list'),
    url(r'^items/(?P<pk>\d+)/$', ItemDetail.as_view(), name='item-detail'),
    url(r'^vendors/$', VendorList.as_view(), name='vendor-list'),
    url(r'^vendors/(?P<pk>\d+)/$', VendorDetail.as_view(), name='vendor-detail'),
    url(r'^shifts/$', ShiftList.as_view(), name='shift-list'),
    url(r'^shifts/(?P<pk>\d+)/$', ShiftDetail.as_view(), name='shift-detail'),
    url(r'^transactions/$', TransactionList.as_view(), name='transaction-list'),
    url(r'^transactions/(?P<pk>\d+)/$', TransactionDetail.as_view(), name='transaction-detail'),
    url(r'^line_items/$', LineItemList.as_view(), name='lineitem-list'),
    url(r'^line_items/(?P<pk>\d+)/$', LineItemDetail.as_view(), name='lineitem-detail'),

)

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])

urlpatterns += patterns('',
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)
