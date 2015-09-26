#    Copyright 2013 Jack David Baucum
#
#    This file is part of Orthosie.
#
#    Orthosie is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    Orthosie is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with Orthosie.  If not, see <http://www.gnu.org/licenses/>.

from django.conf.urls import patterns, include, url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from inventory.api_views import ItemViewSet, GroceryViewSet, ProduceViewSet, VendorViewSet
from register.api_views import ShiftViewSet, TransactionViewSet, LineItemViewSet, TenderViewSet

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^register/', include('register.urls')),
    url(r'^inventory/', include('inventory.urls')),
)

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'api'])

router = routers.DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'groceries', GroceryViewSet)
router.register(r'produce', ProduceViewSet)
router.register(r'vendors', VendorViewSet)
router.register(r'shifts', ShiftViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'line-items', LineItemViewSet)
router.register(r'tenders', TenderViewSet)

urlpatterns += patterns(
    '',
    url(r'^', include(router.urls)),
    url(
        r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')
    )
)
