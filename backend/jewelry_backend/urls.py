from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from store.views import (
    ProductViewSet, CategoryViewSet, ColorViewSet, SizeViewSet,
    SliderViewSet, HomeGroupViewSet, PageViewSet, CountryViewSet, StateViewSet
)
from orders.views import OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'colors', ColorViewSet)
router.register(r'sizes', SizeViewSet)
router.register(r'sliders', SliderViewSet)
router.register(r'home-groups', HomeGroupViewSet)
router.register(r'pages', PageViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'states', StateViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
